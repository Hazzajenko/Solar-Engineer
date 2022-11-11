package helpers

import "strconv"

type Helpers struct {
}

func InitHelpers() Helpers {
	return Helpers{}
}

func (h *Helpers) GetInt64FromURLParam(param string) (int64, error) {
	result, err := strconv.ParseInt(param, 10, 64)
	if err != nil {
		return 0, err
	}
	return result, nil
}
