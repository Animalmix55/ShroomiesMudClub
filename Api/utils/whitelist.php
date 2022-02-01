<?php
    $secondaryLocation = realpath(__DIR__ . '/../data/SecondaryWhitelist.json');
    $mainLocation = realpath(__DIR__ . '/../data/MainWhitelist.json');

    function getSecondaryWhitelist() {
        global $secondaryLocation;
        return json_decode(file_get_contents($secondaryLocation));
    }

    function getMainWhitelist() {
        global $mainLocation;
        return json_decode(file_get_contents($mainLocation));
    }

    function secondaryWhitelistCount(string $address) {
        $whitelist = getSecondaryWhitelist();
        $length = count($whitelist);

        $count = 0;
        for ($i = 0; $i < $length; $i++) {
            if (strtolower($whitelist[$i]->address) == strtolower($address)) {
                $count += $whitelist[$i]->amount;
            }
        }

        return $count;
    }

    function mainWhitelistCount(string $address) {
        $whitelist = getMainWhitelist();
        $length = count($whitelist);

        $count = 0;
        for ($i = 0; $i < $length; $i++) {
            if (strtolower($whitelist[$i]->address) == strtolower($address)) {
                $count += $whitelist[$i]->amount;
            }
        }

        return $count;
    }
?>