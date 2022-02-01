<?php
    require_once __DIR__ . "/../vendor/autoload.php";

    use kornrunner\Keccak;
    use Elliptic\EC;
    
    require_once __DIR__ . '/../utils/secrets.php';
    require_once __DIR__ . '/../utils/batch.php';
    require_once __DIR__ . '/../utils/contract.php';
    require_once __DIR__ . '/../utils/whitelist.php';
    
    function signMessage(string $message) {
        $ec = new EC('secp256k1');

        $ecPrivateKey = $ec->keyFromPrivate(getSecret('web3_signer_private'), 'hex');
        $message = hex2bin(substr($message, 2));
        $message = "\x19Ethereum Signed Message:\n" . strlen($message) . $message;

        $hash = Keccak::hash($message, 256);

        $signature = $ecPrivateKey->sign($hash, ['canonical' => true]);

        $r = str_pad($signature->r->toString(16), 64, '0', STR_PAD_LEFT);
        $s = str_pad($signature->s->toString(16), 64, '0', STR_PAD_LEFT);
        $v = dechex($signature->recoveryParam + 27);

        return "0x$r$s$v";
    }

    function processRequest() {
        try {
            switch ($_SERVER['REQUEST_METHOD']) {
                case 'POST':
                    $json = file_get_contents('php://input');
                    $data = json_decode($json);
        
                    if(isset($data->address) && isset($data->batchSecret)) {
                        return getBatchMintCredentials($data->address, $data->batchSecret);
                    }

                    if(isset($data->quantity) && isset($data->mainMint) && isset($data->address)) {
                        return getMintCredentials($data->quantity, $data->mainMint, $data->address);
                    }
                    break;
                case 'OPTIONS':
                    return;
                    break;
                case 'GET':
                case 'PUT':
                default:
                    break;
            }
            http_response_code(404);
        } catch (Exception $e) {
            http_response_code(500);
            die('An error occured');
        }
    }

    function getBatchMintCredentials(string $address, string $batchSecret) {
        $result = array();

        $batch = getBatch($batchSecret);
        if (!$batch) {
            http_response_code(404);
            die('Batch not found');
        }

        $validUntil = $batch->validityPeriod + time();

        $hash = getWhitelistPasswordHash($address, $batch->id, $batch->mainCollection, $batch->size, $validUntil);
        $signature = signMessage($hash);

        $result['signature'] = $signature;
        $result['batchSize'] = $batch->size;
        $result['mainCollection'] = $batch->mainCollection;
        $result['validUntil'] = $validUntil;

        echo json_encode($result);
    }

    function getMintCredentials(int $quantity, bool $mainMint, string $address) {
        if ($quantity <= 0) {
            echo "Invalid quantity";
            http_response_code(500);
            return;
        }

        $nonce = getLastNonce($address) + 1; // GET NONCE BEFORE COUNTS
        $alreadyMinted = getUserWhitelistMints($address);

        if (!$mainMint) {
            $secondaryWhitelistCount = secondaryWhitelistCount($address) - $alreadyMinted['secondary'];
            if ($secondaryWhitelistCount < $quantity) {
                http_response_code(401);
                echo "Cannot mint more than allowed, max $secondaryWhitelistCount";
                return;
            }
        } else {
            $mainWhitelistCount = mainWhitelistCount($address) - $alreadyMinted['main'];
            if ($mainWhitelistCount < $quantity) {
                http_response_code(401);
                echo "Cannot mint more than allowed, max $mainWhitelistCount";
                return;
            }
        }     

        $hash = getUserWhitelistHash($address, $quantity, $mainMint, $nonce);
        $signature = signMessage($hash);

        $result = array();
        $result['signature'] = $signature;
        $result['nonce'] = $nonce;
        echo json_encode($result);
    }

    processRequest();
?>