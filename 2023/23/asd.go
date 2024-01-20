package main

import (
    "fmt"
    "os"
    "strings"
)

type Node struct {
    x, y int
    prev *Node
}

func (n *Node) hasAsPrevious(node Node) bool {
    if n.prev == nil {
        return false
    }
    if n.prev.x == node.x && n.prev.y == node.y {
        return true
    }
    return n.prev.hasAsPrevious(*n.prev)
}

func (n *Node) size() int {
    if n.prev == nil {
        return 1
    }
    return 1 + n.prev.size()
}

func createNewPath(pathId, x, y int, pathMap map[int]*Node, pathIds *[]int, maxId *int, grid [][]string) {
    if x < 0 || y < 0 || x >= len(grid) || y >= len(grid[0]) {
        return
    }
    if grid[x][y] == "#" {
        return
    }

    existingPath := pathMap[pathId]
    newStep := &Node{x, y, existingPath}

    if !existingPath.hasAsPrevious(*newStep) {
        *maxId++
        pathMap[*maxId] = newStep
        *pathIds = append(*pathIds, *maxId)
    }
}

func secondStar(file string) {
	
	fileLines := strings.Split(file, "\n")
	grid := make([][]string, len(fileLines))
	for i, line := range fileLines {
		grid[i] = strings.Split(line, "")
	}

	startY := strings.Index(strings.Join(grid[0], ""), ".")
	endY := strings.Index(strings.Join(grid[len(grid)-1], ""), ".")
	endX := len(grid) - 1

	pathMap := make(map[int]*Node)
	pathMap[0] = &Node{0, startY, nil}

	pathIds := []int{0}
	maxId := 0
	finishedPaths := []int{}

	for len(pathIds) > 0 {
		idCopy := pathIds
		pathIds = []int{}
		for _, path := range idCopy {
			node := pathMap[path]

			if node.x == endX && node.y == endY {
				finishedPaths = append(finishedPaths, path)
				continue
			}

			createNewPath(path, node.x, node.y+1, pathMap, &pathIds, &maxId, grid)
			createNewPath(path, node.x, node.y-1, pathMap, &pathIds, &maxId, grid)
			createNewPath(path, node.x-1, node.y, pathMap, &pathIds, &maxId, grid)
			createNewPath(path, node.x+1, node.y, pathMap, &pathIds, &maxId, grid)

			delete(pathMap, path)
		}
	}

	maxSize := 0
	for _, path := range finishedPaths {
		size := pathMap[path].size() - 1
		if size > maxSize {
			maxSize = size
		}
	}

	fmt.Println("secondStar", maxSize)
}

func main() {
	data, _ := os.ReadFile("file.txt")
	secondStar(string(data))
}