package logger

import (
	"fmt"
	"github.com/fatih/color"
	"io"
	"os"
	"runtime/debug"
	"strings"
	"sync"
	"time"
)

var (
	red    = color.New(color.FgHiRed, color.Bold).SprintFunc()
	yellow = color.New(color.FgHiYellow, color.Bold).SprintFunc()
	cyan   = color.New(color.FgHiCyan, color.Bold).SprintFunc()
)

type Level int8

const (
	LevelInfo  Level = iota // Has the value 0.
	LevelError              // Has the value 1.
	LevelFatal              // Has the value 2.
	LevelOff                // Has the value 3.
)

func (l Level) String() string {
	switch l {
	case LevelInfo:
		return "INFO"
	case LevelError:
		return "ERROR"
	case LevelFatal:
		return "FATAL"
	default:
		return ""
	}
}

type Logger struct {
	out      io.Writer
	minLevel Level
	mu       sync.Mutex
	colorize bool
}

func New(out io.Writer, minLevel Level, colorize bool) *Logger {
	return &Logger{
		out:      out,
		minLevel: minLevel,
		colorize: colorize,
	}
}

func (l *Logger) PrintInfo(message string, properties map[string]string) {
	_, _ = l.print(LevelInfo, message, properties)
	/*	if l.colorize {
			_, _ = l.print(LevelInfo, cyan(message), properties)
		} else {
			_, _ = l.print(LevelInfo, message, properties)
		}*/
}

func (l *Logger) PrintError(err error, properties map[string]string) {
	_, _ = l.print(LevelError, err.Error(), properties)
}
func (l *Logger) PrintFatal(err error, properties map[string]string) {
	_, _ = l.print(LevelFatal, err.Error(), properties)
	os.Exit(1)
}

func (l *Logger) print(level Level, message string, properties map[string]string) (int, error) {
	if level < l.minLevel {
		return 0, nil
	}

	aux := struct {
		Level      string            `json:"level"`
		Time       string            `json:"time"`
		Message    string            `json:"message"`
		Properties map[string]string `json:"properties,omitempty"`
		Trace      string            `json:"trace,omitempty"`
	}{
		Level:      level.String(),
		Time:       time.Now().UTC().Format(time.RFC3339),
		Message:    message,
		Properties: properties,
	}

	if level >= LevelError {
		aux.Trace = string(debug.Stack())
	}

	var line string
	l.mu.Lock()
	defer l.mu.Unlock()
	line = l.textLine(level, message, l.colorize)

	return fmt.Fprintln(l.out, line)
}

func (l *Logger) textLine(level Level, message string, colorize bool) string {
	//str := []string{color.CyanString(message), color.RedString(message)}
	//fmt.Println(strings.Join(str, ""))
	//fmt.Println(color.RedString(level.String()))
	//colormessage := color.CyanString(message)
	//fmt.Println(colormessage)
	//line := fmt.Sprintf("level=%q time=%q message=%q", cyan(level), time.Now().Format(time.RFC3339), colormessage)
	lvl := ""
	msg := ""
	if colorize {
		switch level {
		case LevelError, LevelFatal:
			lvl = color.RedString(level.String())
		case LevelInfo:
			lvl = color.CyanString(level.String())
		}
		msg = color.MagentaString(message)

	}
	toJoin := []string{lvl, msg}
	//if level >= LevelError {
	//	line += fmt.Sprintf("\n%s", string(debug.Stack()))
	//}

	return strings.Join(toJoin, " || ")
}

func (l *Logger) Write(message []byte) (n int, err error) {
	return l.print(LevelError, string(message), nil)
}
