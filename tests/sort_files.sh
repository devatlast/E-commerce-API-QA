echo "------Moving .sh Files to Scripts Directory------"
sleep 1
for files in *.sh; do
  if [[ "$files" != "sort_files.sh" ]]; then
  mv "$files" curlTests/
  fi
done
sleep 1
echo "------Your .sh Files have been sorted-------"