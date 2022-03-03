git checkout gh-pages
git merge main
ng build --output-path docs --base-href /look-alive/
cp docs/index.html docs/404.html
git add .
git commit -m "Build $(date +"%s")"
git push
git checkout main
