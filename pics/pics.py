import glob
from lxml.html import fromstring
from django.template.defaultfilters import slugify
import instaloader

USER = 'blocl.uk'


def headings(fn):
    ls = []
    dom = fromstring(open(fn).read())
    elems = dom.cssselect('h1,h2,h3')
    for h in elems:
        ls.append(h.text)
    return ls


def load():
    loader = instaloader.Instaloader()
    loader.interactive_login(USER)
    for fn in glob.glob('../*.htm'):
        hs = headings(fn)
        print(hs)
        for h in hs:
            hashtag = slugify(h).replace('-', '')
            loader.download_hashtag(hashtag, max_count=10)


def load_posts(loader, hashtag):
    posts = instaloader.Hashtag.from_name(loader.context, hashtag).get_posts()
    for post in posts:
        loader.download_post(post, target=f'#{hashtag}')


if __name__ == '__main__':
    load()
