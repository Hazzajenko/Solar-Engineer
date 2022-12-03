package schema

import "entgo.io/ent"

// Panel holds the schema definition for the Panel entity.
type Panel struct {
	ent.Schema
}

// Fields of the Panel.
func (Panel) Fields() []ent.Field {
	return nil
}

// Edges of the Panel.
func (Panel) Edges() []ent.Edge {
	return nil
}
