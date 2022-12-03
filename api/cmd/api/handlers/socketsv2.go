package handlers

import (
	"fmt"
	"golang.org/x/net/websocket"
	"io"
)

type SocketServer struct {
	conns map[*websocket.Conn]bool
}

func NewServer() *SocketServer {
	return &SocketServer{
		conns: make(map[*websocket.Conn]bool),
	}
}

func (s *SocketServer) HandleWs(ws *websocket.Conn) {
	fmt.Println("new incoming connection from client: ", ws.RemoteAddr())

	s.conns[ws] = true

	s.readLoop(ws)
}

func (s *SocketServer) readLoop(ws *websocket.Conn) {
	buf := make([]byte, 1024)
	for {
		n, err := ws.Read(buf)
		if err != nil {
			if err == io.EOF {
				break
			}
			fmt.Println(err)
			continue
		}
		msg := buf[:n]
		/*		fmt.Println(string(msg))
				ws.Write([]byte("thank you for msg"))*/
		s.broadcast(msg)
	}
}

func (s *SocketServer) broadcast(b []byte) {
	for ws := range s.conns {
		go func(ws *websocket.Conn) {
			if _, err := ws.Write(b); err != nil {
				fmt.Println(err)
			}
		}(ws)
	}
}
