npm run build
git add .
git commit -m "update"
if [ "all" == $1 ]
then
    git push -u gitee
    git push -u github
else 
   git push -u $1
fi
