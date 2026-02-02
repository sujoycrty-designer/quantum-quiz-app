#!/bin/bash
git add .
echo "Commit message:"
read msg
git commit -m "$msg | ©2026 Sujoy"
git push origin main
