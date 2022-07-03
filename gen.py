#!/usr/bin/env python3
from page.gen import generate_site

ROOT = '/Users/f/SITES/'
SOURCE = f'{ROOT}unilex-nom'
TARGET = f'{ROOT}unilex/static/nom'
TPL = f'{ROOT}unilex-nom/_tpl'
EXT = ''  # can be '.htm'/'.html'
CTX = dict(
    site_name='Normy Jedál',
    site_url='https://unilexicon.com/nom',
    repo_url='https://github.com/fmalina/unilex-nom/blob/main/',  # for edit links
    site_root='/nom',
    dev=True  # show/hide editing links
)

if __name__ == '__main__':
    generate_site(SOURCE, TARGET, TPL, EXT, CTX)
