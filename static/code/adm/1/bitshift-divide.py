from sys import argv

def divide(numerator, denominator):
    if numerator == denominator:
        return 1

    if numerator < denominator:
        return 0

    original_denom = denominator
    quotient = 1
    
    while denominator <= numerator:
        denominator = denominator << 1
        quotient = quotient << 1
    
    denominator = denominator >> 1
    quotient = quotient >> 1
    
    return quotient + divide(numerator - denominator, original_denom)


print divide(int(argv[1]), int(argv[2]))
