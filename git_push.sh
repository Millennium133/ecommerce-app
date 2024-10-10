#!/bin/bash

# Add all changes
git add .

# Commit with a message
git commit -m "Able to login with different account in facebook Login"  # You can parameterize this if you want to pass a message as an argument.

# Push to the remote repository
git push -u origin master  # Change "master" to your current branch if needed
