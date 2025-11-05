git reset HEAD~1
rm ./backport.sh
git cherry-pick be8686b5773e970fbe993943170c6d3aa35592a5
echo 'Resolve conflicts and force push this branch.\n\nTo backport translations run: bin/i18n/merge-translations <release-branch>'
