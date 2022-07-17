"""
Instagram loader, hashtagifies all headings in our documents
and downloads from Instagram pictures matching those hashtags
"""

import glob
import os
from lxml.html import fromstring
from django.template.defaultfilters import slugify
import instaloader

USER = 'normyjedal'


def hashtagify(x):
    print(x)
    x = str(x)
    for sep in [' a ', '/', '(', '–', '-']:
        x = x.split(sep)[0]
    return slugify(x.strip()).replace('-', '')


def get_hashtags():
    ls = []
    html_files = [x for x in glob.glob('*') if
                  '.' not in x and
                  '__' not in x and
                  'pic' not in x]
    for fn in html_files:
        dom = fromstring(open(fn).read())
        elems = dom.cssselect('h1,h2,h3')
        for h in elems:
            hashtag = hashtagify(h.text)
            hashtag = ''.join([x for x in hashtag if not x.isdigit()])
            ls.append((fn, hashtag, h.text))
    return ls


def trim_loaded(hashtags):
    loaded = [x for x in glob.glob('pic/*')]
    return [x for x in hashtags if x not in loaded]


def load():
    hashtags = [y for x, y, _text in get_hashtags()]
    hashtags = list(reversed(trim_loaded(hashtags)))
    loader = instaloader.Instaloader()
    loader.interactive_login(USER)
    for h in hashtags:
        loader.download_hashtag(h, max_count=10)


def load_posts(loader, hashtag):
    posts = instaloader.Hashtag.from_name(loader.context, hashtag).get_posts()
    for post in posts:
        loader.download_post(post, target=f'pic/{hashtag}')


output = """find pic -type f\
    -name "*.jpg"\
    -not -name "*.txt"\
    -not -name "*_UTC_*.jpg"\
    -not -name "*_profile_pic.jpg" > pics-all.txt"""

filter = """grep -Fvxf pics-exclude.txt pics-all.txt > pics.txt"""


if __name__ == '__main__':
    load()
    os.system(output)
    os.system(filter)
