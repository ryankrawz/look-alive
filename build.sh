git checkout gh-pages
git merge main
ng build --output-path docs --base-href /look-alive/
git add .
git commit -m "Build ${date +"%s"}"
git push
git checkout main
