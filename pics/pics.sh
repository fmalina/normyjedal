find . -type f\
    -name "*.txt" -or -name "*.jpg"\
    -not -name "*_profile_pic.jpg" > pics.txt
