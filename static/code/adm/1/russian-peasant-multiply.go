package main

import (
	"fmt"
	"os"
	"strconv"
)

func main() {
	a, _ := strconv.ParseInt(os.Args[1], 10, 64)
	b, _ := strconv.ParseInt(os.Args[2], 10, 64)
	fmt.Println(russianPeasant(a, b))
}

func russianPeasant(a int64, b int64) int64 {
	// Initialize the resulting product.
	var p int64 = 0
	for b > 0 {
		// Is the right hand number odd?
		if b%2 != 0 {
			p = p + a
		}
		// Double the left and halve the right.
		a = a << 1
		b = b >> 1
	}
	return p
}
