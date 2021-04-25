""" """
import glob
from lxml.html import fromstring
from django.template.defaultfilters import slugify
import instaloader

USER = 'blocl.uk'

def hashtagify(text):
    print(text)
    return slugify(
        str(text)
        .split(' a ')[0]
        .split('/')[0]
        .split('(')[0]
        .split('–')[0]
        .split('-')[0].strip()
    )


def get_hashtags():
    ls = []
    for fn in glob.glob('../*.htm'):
        dom = fromstring(open(fn).read())
        elems = dom.cssselect('h1,h2,h3')
        for h in elems:
            hashtag = hashtagify(h.text)
            hashtag = ''.join([x for x in hashtag if not x.isdigit()])
            ls.append(hashtag)
    return ls


def trim_loaded(hashtags):
    loaded = [x.strip('#') for x in glob.glob('#*')]
    return [x for x in hashtags if x not in loaded]


def load():
    hashtags = list(reversed(trim_loaded(get_hashtags())))
    loader = instaloader.Instaloader()
    loader.interactive_login(USER)
    for h in hashtags:
        loader.download_hashtag(h, max_count=10)


def load_posts(loader, hashtag):
    posts = instaloader.Hashtag.from_name(loader.context, hashtag).get_posts()
    for post in posts:
        loader.download_post(post, target=f'#{hashtag}')


if __name__ == '__main__':
    load()
