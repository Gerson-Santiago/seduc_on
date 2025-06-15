#!/bin/bash

for file in *.csv; do
  if [[ "$file" == "csv_headers.csv" ]]; then
    continue
  fi

  header_file="${file%.csv}_headers.csv"
  head -n 1 "$file" > "$header_file"
done
