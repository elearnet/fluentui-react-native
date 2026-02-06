#!/bin/bash
module_path='elui'
cd ..
git rm -rf --cached ${module_path} # .git/index
git config -f .gitmodules --remove-section "submodule.${module_path}" # ./.gitmodules
git config -f --remove-section "submodule.${module_path}" # ./.git/config
rm -rf ${module_path}
rm -rf .git/modules/${module_path}

#git commit -m "Removed submodule"

# .gitmodules
# .git/config
# .git/index
# git submodule deinit -f libs/react-native
