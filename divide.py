from sys import argv

def divide(a, b):
    q = 0
    s = 0
    while s < a:
        s = s + b
        q = q + 1
    return q

print divide(int(argv[1]), int(argv[2]))

