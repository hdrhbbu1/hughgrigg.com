from sys import argv

def multiply(a, b):
	i = 0
	p = 0
	while i < a:
		p = p + b
		i = i + 1
	return p

print multiply(int(argv[1]), int(argv[2]))
