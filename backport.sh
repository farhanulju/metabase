git reset HEAD~1
rm ./backport.sh
git cherry-pick e39c2119d269cd9700db6a04785459e66ba9355a
echo 'Resolve conflicts and force push this branch.\n\nTo backport translations run: bin/i18n/merge-translations <release-branch>'
