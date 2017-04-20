package main

import (
	"bytes"
	"fmt"
	"math"
	"math/rand"
	"time"
)

func main() {
	rand.Seed(time.Now().UTC().UnixNano())
	points := PointSet{
		"a": Point{randomCoord(20), randomCoord(10)},
		"b": Point{randomCoord(20), randomCoord(10)},
		"c": Point{randomCoord(20), randomCoord(10)},
		"d": Point{randomCoord(20), randomCoord(10)},
		"e": Point{randomCoord(20), randomCoord(10)},
	}
	fmt.Println(Draw(points))
	fmt.Println(Tour(points))
}

type Point struct {
	x float64
	y float64
}

type PointSet map[string]Point

func Tour(points PointSet) []string {
	var tour []string
	var visit string
	for label, _ := range points {
		visit = label
		break
	}
	for len(points) > 0 {
		tour = append(tour, visit)
		point := points[visit]
		delete(points, visit)
		visit = point.NearestNeighbour(points)
	}
	return tour
}

func (p *Point) NearestNeighbour(neighbours PointSet) string {
	var min float64
	var nearest string
	for label, neighbour := range neighbours {
		if dist := p.DistanceTo(neighbour); min == 0.0 || dist < min {
			min = dist
			nearest = label
		}
	}
	return nearest
}

func (p *Point) DistanceTo(other Point) float64 {
	return math.Sqrt(math.Pow(p.x-other.x, 2) + math.Pow(p.y-other.y, 2))
}

func Draw(points PointSet) string {
	var draw bytes.Buffer
	cols := xRange(points) + 2
	rows := yRange(points) + 2
	for y := 0; y < rows; y++ {
		for x := 0; x < cols; x++ {
			draw.WriteString(LabelAt(points, x, y))
		}
		draw.WriteString("\n")
	}

	return draw.String()
}

func xRange(points PointSet) int {
	var min float64
	var max float64
	for _, p := range points {
		if p.x < min {
			min = p.x
		}
		if p.x > max {
			max = p.x
		}
	}
	return int(math.Abs(max - min))
}

func yRange(points PointSet) int {
	var min float64
	var max float64
	for _, p := range points {
		if p.y < min {
			min = p.y
		}
		if p.y > max {
			max = p.y
		}
	}
	return int(math.Abs(max - min))
}

func LabelAt(ps PointSet, x int, y int) string {
	for label, p := range ps {
		if int(p.x) == x && int(p.y) == y {
			return label
		}
	}
	return "·"
}

func randomCoord(max int) float64 {
	return float64(rand.Intn(max))
}
