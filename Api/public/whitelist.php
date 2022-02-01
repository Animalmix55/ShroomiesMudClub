<?php
    require_once __DIR__ . "/../vendor/autoload.php";
    require_once __DIR__ . '/../utils/whitelist.php';
    require_once __DIR__ . '/../utils/contract.php';

    function processRequest() {
        try {
            switch ($_SERVER['REQUEST_METHOD']) {
                case 'GET':
                    if (isset($_GET['address'])) {
                        return getWhitelist($_GET['address']);
                    }
                    break;
                case 'POST':
                case 'PUT':
                default:
                     break;
            }
            http_response_code(404);
        } catch (Exception $e) {
            http_response_code(500);
            die('An error occurred');
        }
    }

    function getWhitelist($address) {
        $secondaryWhitelist = getSecondaryWhitelist();
        $mainWhitelist = getMainWhitelist();
        
        $mainWhitelistLength = count($mainWhitelist);
        $secondaryWhitelistLength = count($secondaryWhitelist);

        $maxLength = max($secondaryWhitelistLength, $mainWhitelistLength);

        $result = array();
        $result['main'] = 0;
        $result['secondary'] = 0;

        for ($i = 0; $i < $maxLength; $i++) {
            if ($i < $mainWhitelistLength) {
                if (strtolower($mainWhitelist[$i]->address) === strtolower($address)) {
                    $result['main'] += $mainWhitelist[$i]->amount;
                }
            }

            if ($i < $secondaryWhitelistLength) {
                if (strtolower($secondaryWhitelist[$i]->address) === strtolower($address)) {
                    $result['secondary'] += $secondaryWhitelist[$i]->amount;
                }
            }
        }

        if ($result['main'] != 0 || $result['secondary'] != 0) {
            $alreadyMinted = getUserWhitelistMints($address);
            $result['main'] = max($result['main'] - $alreadyMinted['main'], 0);
            $result['secondary'] = max($result['secondary'] - $alreadyMinted['secondary'], 0);
        }
        
        echo json_encode($result);
        return;
    }

    processRequest();
?>