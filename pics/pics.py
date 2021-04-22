import glob
from lxml.html import fromstring
from django.template.defaultfilters import slugify
from instaloader import Instaloader


def get_hashtags(fn):
    hashtags = []
    dom = fromstring(open(fn).read())
    headings = dom.cssselect('h1,h2,h3')
    for h in headings:
        hashtags.append(slugify(h.text).replace('-',''))
    return hashtags


def load():
    for fn in glob.glob('*.ht*'):
        for hashtag in get_hashtags(fn):
            Instaloader.download_hashtag(hashtag)


if __name__ == '__main__':
    load()
