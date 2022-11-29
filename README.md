# callfilter-decoder
Simple script to decrypt [callfilter.app](https://callfilter.app) database

It's just reverse engineering an android app. Made for educational purposes only.

To unload the database, download ZIP archives and unzip them next to the script.

Modify and use this script however you like.

Base file structure:
```
2 bytes for header: ZI

3 bytes for count of numbers

2 bytes for version of db

6 bytes for each number

3 bytes for file ending: ZID
```
