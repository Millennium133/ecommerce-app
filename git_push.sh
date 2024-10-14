#!/bin/bash

# Add all changes
git add .

# Commit with a message
git commit -m "Improve UXUI in ProductList (Pagination, lazy loading) and Set some security (request rate limit) in backend"  # You can parameterize this if you want to pass a message as an argument.

# Push to the remote repository
git push -u origin master  # Change "master" to your current branch if needed
