git checkout gh-pages
ng build --output-path docs --base-href /look-alive/
git add .
git commit -m "Build ${date +"%s"}"
git push
