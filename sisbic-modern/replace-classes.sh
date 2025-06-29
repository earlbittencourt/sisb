#!/bin/bash

# Função para fazer substituições em todos os arquivos TypeScript e JavaScript
function replace_in_files() {
    local search=$1
    local replace=$2
    local files_pattern=$3
    
    find . -type f -name "$files_pattern" -exec sed -i '' "s/$search/$replace/g" {} +
}

# Substituições de cores e estilos
replace_in_files "bg-slate-50" "bg-gray-50" "*.{ts,tsx,js,jsx}"
replace_in_files "dark:bg-slate-900" "dark:bg-gray-900" "*.{ts,tsx,js,jsx}"
replace_in_files "bg-white dark:bg-slate-800" "bg-white dark:bg-gray-800" "*.{ts,tsx,js,jsx}"
replace_in_files "bg-white dark:bg-slate-700" "bg-white dark:bg-gray-800" "*.{ts,tsx,js,jsx}"
replace_in_files "border-slate-200" "border-gray-200" "*.{ts,tsx,js,jsx}"
replace_in_files "dark:border-slate-700" "dark:border-gray-700" "*.{ts,tsx,js,jsx}"
replace_in_files "text-neutral-800" "text-gray-700" "*.{ts,tsx,js,jsx}"
replace_in_files "dark:text-slate-100" "dark:text-gray-200" "*.{ts,tsx,js,jsx}"
replace_in_files "text-neutral-500" "text-gray-500" "*.{ts,tsx,js,jsx}"
replace_in_files "dark:text-slate-400" "dark:text-gray-400" "*.{ts,tsx,js,jsx}"
replace_in_files "shadow-elite" "shadow-card" "*.{ts,tsx,js,jsx}"
replace_in_files "shadow-lifted" "shadow-modal" "*.{ts,tsx,js,jsx}"
replace_in_files "bg-neutral-50" "bg-gray-50" "*.{ts,tsx,js,jsx}"
replace_in_files "dark:bg-neutral-800" "dark:bg-gray-800" "*.{ts,tsx,js,jsx}"
replace_in_files "text-neutral-400" "text-gray-400" "*.{ts,tsx,js,jsx}"
replace_in_files "dark:text-neutral-400" "dark:text-gray-400" "*.{ts,tsx,js,jsx}"
replace_in_files "text-neutral-700" "text-gray-700" "*.{ts,tsx,js,jsx}"
replace_in_files "dark:text-neutral-300" "dark:text-gray-300" "*.{ts,tsx,js,jsx}"
replace_in_files "hover:bg-neutral-50" "hover:bg-gray-50" "*.{ts,tsx,js,jsx}"
replace_in_files "dark:hover:bg-neutral-600" "dark:hover:bg-gray-600" "*.{ts,tsx,js,jsx}"
replace_in_files "bg-neutral-800" "bg-gray-800" "*.{ts,tsx,js,jsx}"
replace_in_files "text-neutral-900" "text-gray-900" "*.{ts,tsx,js,jsx}"
replace_in_files "bg-neutral-100" "bg-gray-100" "*.{ts,tsx,js,jsx}"
replace_in_files "dark:hover:bg-neutral-700" "dark:hover:bg-gray-700" "*.{ts,tsx,js,jsx}"
replace_in_files "text-neutral-600" "text-gray-600" "*.{ts,tsx,js,jsx}"
replace_in_files "dark:text-neutral-100" "dark:text-gray-100" "*.{ts,tsx,js,jsx}" 