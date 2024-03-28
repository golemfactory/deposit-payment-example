#!/bin/bash

file_name=$1
temp_dir=/golem/output/temp
rm -rf $temp_dir/*
mkdir $temp_dir

clamscan --gen-json --leave-temps --tempdir=$temp_dir $file_name

metadata_file=$(find $temp_dir -name "metadata.json" -type f)

# Move metadata.json to the ./temp directory
if [ -f "$metadata_file" ]; then
  mv "$metadata_file" $temp_dir
fi

echo "Cleanup complete."
