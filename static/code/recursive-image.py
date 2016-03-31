from __future__ import division
import argparse
from PIL import Image
from math import log

parser = argparse.ArgumentParser()
parser.add_argument("start_file", help="filename of initial image")
parser.add_argument(
    "-x",
    "--xpercent",
    default=25,
    nargs='?',
    const=1,
    type=int,
    help="percentage left starting point of recursive overlay"
)
parser.add_argument(
    "-y",
    "--ypercent",
    default=25,
    nargs='?',
    const=1,
    type=int,
    help="percentage top starting point of recursive overlay"
)
parser.add_argument(
    "-s",
    "--size",
    default=50,
    nargs='?',
    const=1,
    type=int,
    help="percentage size of recursive overlay"
)
parser.add_argument(
    "-o",
    "--outfile",
    default="recurse.png",
    help="output filename"
)
args = parser.parse_args()

args.size = max(min(99, abs(args.size)), 1)

img = Image.open(args.start_file)
iWidth, iHeight = img.size

xPos = int(round((args.xpercent / 100) * iWidth))
yPos = int(round((args.ypercent / 100) * iHeight))
childWidth = int(round((args.size / 100) * iWidth))
childHeight = int(round((args.size / 100) * iHeight))

base = max(int(100 / args.size), 2)
iterations = int(log(iWidth, base))
print("iterations: %d" % iterations)

for i in range(iterations):
    child = img.copy().resize(
        (childWidth, childHeight),
        Image.ANTIALIAS
    )
    img.paste(child, (xPos, yPos))

img.save(args.outfile)
