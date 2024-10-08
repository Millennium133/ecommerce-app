#!/bin/bash

# Add all changes
git add .

# Commit with a message
git commit -m "Update the UI of header, Modify the edit Product page in frontend, Add logger to every function in backend, add fundamental of notification and wishlist"  # You can parameterize this if you want to pass a message as an argument.

# Push to the remote repository
git push -u origin master  # Change "master" to your current branch if needed
