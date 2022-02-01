<?php
    $batchLocation = realpath(__DIR__ . '/../data/Batches.json');

    function getBatches() {
        global $batchLocation;
        return json_decode(file_get_contents($batchLocation));
    }

    function getBatch(string $batchSecret) {
        $pieces = explode("-", $batchSecret);
        $id = $pieces[0];
        $password = $pieces[1];

        $batches = getBatches();

        foreach ($batches as $batch) {
            if ($batch->id === $id && $batch->password == $password) return $batch;
        }

        return false;
    }
?>