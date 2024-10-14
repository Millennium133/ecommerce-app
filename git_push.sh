#!/bin/bash

# Add all changes
git add .

# Commit with a message
git commit -m "Set up Nginx for load_balancing with both static and dev file"  # You can parameterize this if you want to pass a message as an argument.

# Push to the remote repository
git push -u origin master  # Change "master" to your current branch if needed
