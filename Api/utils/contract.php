<?php
    require_once __DIR__ . '/secrets.php';
    use Web3\Contract;

    function getTokenContract() {
        return new Contract(getSecret('web3_provider'), file_get_contents(realpath(__DIR__ . '/../data/TokenABI.json')));
    }

    function getLastNonce(string $address) {
        global $nonce;

        $contract = getTokenContract();
        $nonce;

        $contractAddress = getSecret('token_contract_address');
        if ($contractAddress == false) die('Missing address');
        
        $contract->at($contractAddress)->call('lastMintNonce', $address, function($err, $n) use(&$nonce) {
            if ($err) {
                echo "Could not communicate with chain";
                http_response_code(500);
                exit();
            }
            $nonce = $n;
        });

        return intVal($nonce[0]->toString(), 10);
    }

    function getWhitelistPasswordHash(string $minter, string $batch, bool $main, int $batchSize, int $validUntil) {
        $contract = getTokenContract();
        $hash = '';

        $contractAddress = getSecret('token_contract_address');
        if ($contractAddress == false) die('Missing address');
        
        $contract->at($contractAddress)->call('getWhitelistPasswordHash', $minter, $batch, $main, $batchSize, $validUntil, function($err, $h) use(&$hash) {
            if ($err) {
                echo "Could not communicate with chain";
                http_response_code(500);
                exit();
            }
            $hash = $h;
        });

        return strVal($hash[0]);
    }

    function getUserWhitelistHash(string $minter, int $quantity, bool $main, int $nonce) {
        $contract = getTokenContract();
        $hash = '';

        $contractAddress = getSecret('token_contract_address');
        if ($contractAddress == false) die('Missing address');
        
        $contract->at($contractAddress)->call('getUserWhitelistHash', $minter, $quantity, $main, $nonce, function($err, $h) use(&$hash) {
            if ($err) {
                echo "Could not communicate with chain";
                http_response_code(500);
                exit();
            }
            $hash = $h;
        });

        return strVal($hash[0]);
    }

    function getUserWhitelistMints(string $address) {
        $contract = getTokenContract();
        $result = array();

        $result['main'] = 0;
        $result['secondary'] = 0;

        $contractAddress = getSecret('token_contract_address');
        if ($contractAddress == false) die('Missing address');

        $contract->at($contractAddress)->call('getUserWhitelistMints', $address, function($err, $fm) use(&$result) {
            if ($err) {
                echo "Could not communicate with chain";
                http_response_code(500);
                exit();
            }

            $main = intval($fm['main']->toString());
            $secondary = intval($fm['secondary']->toString());

            $result['main'] = $main;
            $result['secondary'] = $secondary;
        });

        return $result;
    }

    function getMintDates() {
        $result = array(
            'whitelist' => array(
                'start' => 0,
                'end' => 0,
            ),
            'public' => array(
                'start' => 0,
            ),
        );
        $contract = getTokenContract();

        $address = getSecret('token_contract_address');
        if ($address == false) die('Missing address');

        $contract->at($address)->call('publicMint', function($err, $fm) use(&$result) {
            if ($err) {
                echo "Could not communicate with chain";
                http_response_code(500);
                exit();
            }
            $start = intval($fm['startDate']->toString());

            $result['public']['start'] = $start;
        });
        
        $contract->at($address)->call('whitelistMint', function($err, $fm) use(&$result) {
            if ($err) {
                echo "Could not communicate with chain";
                http_response_code(500);
                exit();
            }
            $start = intval($fm['startDate']->toString());
            $end = intval($fm['endDate']->toString());

            $result['whitelist']['start'] = $start;
            $result['whitelist']['end'] = $end;
        });

        return $result;
    }

    function mintsActive() {
        $dates = getMintDates();

        $result['whitelistMintActive'] = $dates['whitelist']['start'] <= time() && $dates['whitelist']['end'] > time();
        $result['publicMintActive'] = $dates['public']['start'] <= time();

        return $result;
    }
