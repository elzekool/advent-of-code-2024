CC = g++

all: day9a day9b
debug: clean day9a_debug day9b_debug

day9a: day9a.cpp
	$(CC) -o day9a day9a.cpp

day9b: day9b.cpp
	$(CC) -o day9b day9b.cpp

day9a_debug: day9a.cpp
	$(CC) -DIS_DEBUG -o day9a day9a.cpp

day9b_debug: day9b.cpp
	$(CC) -DIS_DEBUG -o day9b day9b.cpp

clean:
	rm -f day9a day9b