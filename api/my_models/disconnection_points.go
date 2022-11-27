// Code generated by SQLBoiler 4.13.0 (https://github.com/volatiletech/sqlboiler). DO NOT EDIT.
// This file is meant to be re-generated in place and/or deleted at any time.

package models

import (
	"context"
	"database/sql"
	"fmt"
	"reflect"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/friendsofgo/errors"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"github.com/volatiletech/sqlboiler/v4/queries"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
	"github.com/volatiletech/sqlboiler/v4/queries/qmhelper"
	"github.com/volatiletech/strmangle"
)

// DisconnectionPoint is an object representing the database table.
type DisconnectionPoint struct {
	ID                string `boil:"id" json:"id" toml:"id" yaml:"id"`
	ProjectID         int64  `boil:"project_id" json:"project_id" toml:"project_id" yaml:"project_id"`
	StringID          string `boil:"string_id" json:"string_id" toml:"string_id" yaml:"string_id"`
	PositiveID        string `boil:"positive_id" json:"positive_id" toml:"positive_id" yaml:"positive_id"`
	NegativeID        string `boil:"negative_id" json:"negative_id" toml:"negative_id" yaml:"negative_id"`
	Location          string `boil:"location" json:"location" toml:"location" yaml:"location"`
	DisconnectionType int    `boil:"disconnection_type" json:"disconnection_type" toml:"disconnection_type" yaml:"disconnection_type"`
	Model             int    `boil:"model" json:"model" toml:"model" yaml:"model"`
	Color             string `boil:"color" json:"color" toml:"color" yaml:"color"`

	R *disconnectionPointR `boil:"-" json:"-" toml:"-" yaml:"-"`
	L disconnectionPointL  `boil:"-" json:"-" toml:"-" yaml:"-"`
}

var DisconnectionPointColumns = struct {
	ID                string
	ProjectID         string
	StringID          string
	PositiveID        string
	NegativeID        string
	Location          string
	DisconnectionType string
	Model             string
	Color             string
}{
	ID:                "id",
	ProjectID:         "project_id",
	StringID:          "string_id",
	PositiveID:        "positive_id",
	NegativeID:        "negative_id",
	Location:          "location",
	DisconnectionType: "disconnection_type",
	Model:             "model",
	Color:             "color",
}

var DisconnectionPointTableColumns = struct {
	ID                string
	ProjectID         string
	StringID          string
	PositiveID        string
	NegativeID        string
	Location          string
	DisconnectionType string
	Model             string
	Color             string
}{
	ID:                "disconnection_points.id",
	ProjectID:         "disconnection_points.project_id",
	StringID:          "disconnection_points.string_id",
	PositiveID:        "disconnection_points.positive_id",
	NegativeID:        "disconnection_points.negative_id",
	Location:          "disconnection_points.location",
	DisconnectionType: "disconnection_points.disconnection_type",
	Model:             "disconnection_points.model",
	Color:             "disconnection_points.color",
}

// Generated where

var DisconnectionPointWhere = struct {
	ID                whereHelperstring
	ProjectID         whereHelperint64
	StringID          whereHelperstring
	PositiveID        whereHelperstring
	NegativeID        whereHelperstring
	Location          whereHelperstring
	DisconnectionType whereHelperint
	Model             whereHelperint
	Color             whereHelperstring
}{
	ID:                whereHelperstring{field: "\"disconnection_points\".\"id\""},
	ProjectID:         whereHelperint64{field: "\"disconnection_points\".\"project_id\""},
	StringID:          whereHelperstring{field: "\"disconnection_points\".\"string_id\""},
	PositiveID:        whereHelperstring{field: "\"disconnection_points\".\"positive_id\""},
	NegativeID:        whereHelperstring{field: "\"disconnection_points\".\"negative_id\""},
	Location:          whereHelperstring{field: "\"disconnection_points\".\"location\""},
	DisconnectionType: whereHelperint{field: "\"disconnection_points\".\"disconnection_type\""},
	Model:             whereHelperint{field: "\"disconnection_points\".\"model\""},
	Color:             whereHelperstring{field: "\"disconnection_points\".\"color\""},
}

// DisconnectionPointRels is where relationship names are stored.
var DisconnectionPointRels = struct {
	Project string
	String  string
}{
	Project: "Project",
	String:  "String",
}

// disconnectionPointR is where relationships are stored.
type disconnectionPointR struct {
	Project *Project `boil:"Project" json:"Project" toml:"Project" yaml:"Project"`
	String  *String  `boil:"String" json:"String" toml:"String" yaml:"String"`
}

// NewStruct creates a new relationship struct
func (*disconnectionPointR) NewStruct() *disconnectionPointR {
	return &disconnectionPointR{}
}

func (r *disconnectionPointR) GetProject() *Project {
	if r == nil {
		return nil
	}
	return r.Project
}

func (r *disconnectionPointR) GetString() *String {
	if r == nil {
		return nil
	}
	return r.String
}

// disconnectionPointL is where Load methods for each relationship are stored.
type disconnectionPointL struct{}

var (
	disconnectionPointAllColumns            = []string{"id", "project_id", "string_id", "positive_id", "negative_id", "location", "disconnection_type", "model", "color"}
	disconnectionPointColumnsWithoutDefault = []string{"id", "project_id", "string_id", "positive_id", "negative_id"}
	disconnectionPointColumnsWithDefault    = []string{"location", "disconnection_type", "model", "color"}
	disconnectionPointPrimaryKeyColumns     = []string{"id"}
	disconnectionPointGeneratedColumns      = []string{}
)

type (
	// DisconnectionPointSlice is an alias for a slice of pointers to DisconnectionPoint.
	// This should almost always be used instead of []DisconnectionPoint.
	DisconnectionPointSlice []*DisconnectionPoint
	// DisconnectionPointHook is the signature for custom DisconnectionPoint hook methods
	DisconnectionPointHook func(context.Context, boil.ContextExecutor, *DisconnectionPoint) error

	disconnectionPointQuery struct {
		*queries.Query
	}
)

// Cache for insert, update and upsert
var (
	disconnectionPointType                 = reflect.TypeOf(&DisconnectionPoint{})
	disconnectionPointMapping              = queries.MakeStructMapping(disconnectionPointType)
	disconnectionPointPrimaryKeyMapping, _ = queries.BindMapping(disconnectionPointType, disconnectionPointMapping, disconnectionPointPrimaryKeyColumns)
	disconnectionPointInsertCacheMut       sync.RWMutex
	disconnectionPointInsertCache          = make(map[string]insertCache)
	disconnectionPointUpdateCacheMut       sync.RWMutex
	disconnectionPointUpdateCache          = make(map[string]updateCache)
	disconnectionPointUpsertCacheMut       sync.RWMutex
	disconnectionPointUpsertCache          = make(map[string]insertCache)
)

var (
	// Force time package dependency for automated UpdatedAt/CreatedAt.
	_ = time.Second
	// Force qmhelper dependency for where clause generation (which doesn't
	// always happen)
	_ = qmhelper.Where
)

var disconnectionPointAfterSelectHooks []DisconnectionPointHook

var disconnectionPointBeforeInsertHooks []DisconnectionPointHook
var disconnectionPointAfterInsertHooks []DisconnectionPointHook

var disconnectionPointBeforeUpdateHooks []DisconnectionPointHook
var disconnectionPointAfterUpdateHooks []DisconnectionPointHook

var disconnectionPointBeforeDeleteHooks []DisconnectionPointHook
var disconnectionPointAfterDeleteHooks []DisconnectionPointHook

var disconnectionPointBeforeUpsertHooks []DisconnectionPointHook
var disconnectionPointAfterUpsertHooks []DisconnectionPointHook

// doAfterSelectHooks executes all "after Select" hooks.
func (o *DisconnectionPoint) doAfterSelectHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	if boil.HooksAreSkipped(ctx) {
		return nil
	}

	for _, hook := range disconnectionPointAfterSelectHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doBeforeInsertHooks executes all "before insert" hooks.
func (o *DisconnectionPoint) doBeforeInsertHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	if boil.HooksAreSkipped(ctx) {
		return nil
	}

	for _, hook := range disconnectionPointBeforeInsertHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doAfterInsertHooks executes all "after Insert" hooks.
func (o *DisconnectionPoint) doAfterInsertHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	if boil.HooksAreSkipped(ctx) {
		return nil
	}

	for _, hook := range disconnectionPointAfterInsertHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doBeforeUpdateHooks executes all "before Update" hooks.
func (o *DisconnectionPoint) doBeforeUpdateHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	if boil.HooksAreSkipped(ctx) {
		return nil
	}

	for _, hook := range disconnectionPointBeforeUpdateHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doAfterUpdateHooks executes all "after Update" hooks.
func (o *DisconnectionPoint) doAfterUpdateHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	if boil.HooksAreSkipped(ctx) {
		return nil
	}

	for _, hook := range disconnectionPointAfterUpdateHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doBeforeDeleteHooks executes all "before Delete" hooks.
func (o *DisconnectionPoint) doBeforeDeleteHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	if boil.HooksAreSkipped(ctx) {
		return nil
	}

	for _, hook := range disconnectionPointBeforeDeleteHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doAfterDeleteHooks executes all "after Delete" hooks.
func (o *DisconnectionPoint) doAfterDeleteHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	if boil.HooksAreSkipped(ctx) {
		return nil
	}

	for _, hook := range disconnectionPointAfterDeleteHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doBeforeUpsertHooks executes all "before Upsert" hooks.
func (o *DisconnectionPoint) doBeforeUpsertHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	if boil.HooksAreSkipped(ctx) {
		return nil
	}

	for _, hook := range disconnectionPointBeforeUpsertHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doAfterUpsertHooks executes all "after Upsert" hooks.
func (o *DisconnectionPoint) doAfterUpsertHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	if boil.HooksAreSkipped(ctx) {
		return nil
	}

	for _, hook := range disconnectionPointAfterUpsertHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// AddDisconnectionPointHook registers your hook function for all future operations.
func AddDisconnectionPointHook(hookPoint boil.HookPoint, disconnectionPointHook DisconnectionPointHook) {
	switch hookPoint {
	case boil.AfterSelectHook:
		disconnectionPointAfterSelectHooks = append(disconnectionPointAfterSelectHooks, disconnectionPointHook)
	case boil.BeforeInsertHook:
		disconnectionPointBeforeInsertHooks = append(disconnectionPointBeforeInsertHooks, disconnectionPointHook)
	case boil.AfterInsertHook:
		disconnectionPointAfterInsertHooks = append(disconnectionPointAfterInsertHooks, disconnectionPointHook)
	case boil.BeforeUpdateHook:
		disconnectionPointBeforeUpdateHooks = append(disconnectionPointBeforeUpdateHooks, disconnectionPointHook)
	case boil.AfterUpdateHook:
		disconnectionPointAfterUpdateHooks = append(disconnectionPointAfterUpdateHooks, disconnectionPointHook)
	case boil.BeforeDeleteHook:
		disconnectionPointBeforeDeleteHooks = append(disconnectionPointBeforeDeleteHooks, disconnectionPointHook)
	case boil.AfterDeleteHook:
		disconnectionPointAfterDeleteHooks = append(disconnectionPointAfterDeleteHooks, disconnectionPointHook)
	case boil.BeforeUpsertHook:
		disconnectionPointBeforeUpsertHooks = append(disconnectionPointBeforeUpsertHooks, disconnectionPointHook)
	case boil.AfterUpsertHook:
		disconnectionPointAfterUpsertHooks = append(disconnectionPointAfterUpsertHooks, disconnectionPointHook)
	}
}

// One returns a single disconnectionPoint record from the query.
func (q disconnectionPointQuery) One(ctx context.Context, exec boil.ContextExecutor) (*DisconnectionPoint, error) {
	o := &DisconnectionPoint{}

	queries.SetLimit(q.Query, 1)

	err := q.Bind(ctx, exec, o)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, sql.ErrNoRows
		}
		return nil, errors.Wrap(err, "models: failed to execute a one query for disconnection_points")
	}

	if err := o.doAfterSelectHooks(ctx, exec); err != nil {
		return o, err
	}

	return o, nil
}

// All returns all DisconnectionPoint records from the query.
func (q disconnectionPointQuery) All(ctx context.Context, exec boil.ContextExecutor) (DisconnectionPointSlice, error) {
	var o []*DisconnectionPoint

	err := q.Bind(ctx, exec, &o)
	if err != nil {
		return nil, errors.Wrap(err, "models: failed to assign all query results to DisconnectionPoint slice")
	}

	if len(disconnectionPointAfterSelectHooks) != 0 {
		for _, obj := range o {
			if err := obj.doAfterSelectHooks(ctx, exec); err != nil {
				return o, err
			}
		}
	}

	return o, nil
}

// Count returns the count of all DisconnectionPoint records in the query.
func (q disconnectionPointQuery) Count(ctx context.Context, exec boil.ContextExecutor) (int64, error) {
	var count int64

	queries.SetSelect(q.Query, nil)
	queries.SetCount(q.Query)

	err := q.Query.QueryRowContext(ctx, exec).Scan(&count)
	if err != nil {
		return 0, errors.Wrap(err, "models: failed to count disconnection_points rows")
	}

	return count, nil
}

// Exists checks if the row exists in the table.
func (q disconnectionPointQuery) Exists(ctx context.Context, exec boil.ContextExecutor) (bool, error) {
	var count int64

	queries.SetSelect(q.Query, nil)
	queries.SetCount(q.Query)
	queries.SetLimit(q.Query, 1)

	err := q.Query.QueryRowContext(ctx, exec).Scan(&count)
	if err != nil {
		return false, errors.Wrap(err, "models: failed to check if disconnection_points exists")
	}

	return count > 0, nil
}

// Project pointed to by the foreign key.
func (o *DisconnectionPoint) Project(mods ...qm.QueryMod) projectQuery {
	queryMods := []qm.QueryMod{
		qm.Where("\"id\" = ?", o.ProjectID),
	}

	queryMods = append(queryMods, mods...)

	return Projects(queryMods...)
}

// String pointed to by the foreign key.
func (o *DisconnectionPoint) String(mods ...qm.QueryMod) stringQuery {
	queryMods := []qm.QueryMod{
		qm.Where("\"id\" = ?", o.StringID),
	}

	queryMods = append(queryMods, mods...)

	return Strings(queryMods...)
}

// LoadProject allows an eager lookup of values, cached into the
// loaded structs of the objects. This is for an N-1 relationship.
func (disconnectionPointL) LoadProject(ctx context.Context, e boil.ContextExecutor, singular bool, maybeDisconnectionPoint interface{}, mods queries.Applicator) error {
	var slice []*DisconnectionPoint
	var object *DisconnectionPoint

	if singular {
		var ok bool
		object, ok = maybeDisconnectionPoint.(*DisconnectionPoint)
		if !ok {
			object = new(DisconnectionPoint)
			ok = queries.SetFromEmbeddedStruct(&object, &maybeDisconnectionPoint)
			if !ok {
				return errors.New(fmt.Sprintf("failed to set %T from embedded struct %T", object, maybeDisconnectionPoint))
			}
		}
	} else {
		s, ok := maybeDisconnectionPoint.(*[]*DisconnectionPoint)
		if ok {
			slice = *s
		} else {
			ok = queries.SetFromEmbeddedStruct(&slice, maybeDisconnectionPoint)
			if !ok {
				return errors.New(fmt.Sprintf("failed to set %T from embedded struct %T", slice, maybeDisconnectionPoint))
			}
		}
	}

	args := make([]interface{}, 0, 1)
	if singular {
		if object.R == nil {
			object.R = &disconnectionPointR{}
		}
		args = append(args, object.ProjectID)

	} else {
	Outer:
		for _, obj := range slice {
			if obj.R == nil {
				obj.R = &disconnectionPointR{}
			}

			for _, a := range args {
				if a == obj.ProjectID {
					continue Outer
				}
			}

			args = append(args, obj.ProjectID)

		}
	}

	if len(args) == 0 {
		return nil
	}

	query := NewQuery(
		qm.From(`projects`),
		qm.WhereIn(`projects.id in ?`, args...),
	)
	if mods != nil {
		mods.Apply(query)
	}

	results, err := query.QueryContext(ctx, e)
	if err != nil {
		return errors.Wrap(err, "failed to eager load Project")
	}

	var resultSlice []*Project
	if err = queries.Bind(results, &resultSlice); err != nil {
		return errors.Wrap(err, "failed to bind eager loaded slice Project")
	}

	if err = results.Close(); err != nil {
		return errors.Wrap(err, "failed to close results of eager load for projects")
	}
	if err = results.Err(); err != nil {
		return errors.Wrap(err, "error occurred during iteration of eager loaded relations for projects")
	}

	if len(disconnectionPointAfterSelectHooks) != 0 {
		for _, obj := range resultSlice {
			if err := obj.doAfterSelectHooks(ctx, e); err != nil {
				return err
			}
		}
	}

	if len(resultSlice) == 0 {
		return nil
	}

	if singular {
		foreign := resultSlice[0]
		object.R.Project = foreign
		if foreign.R == nil {
			foreign.R = &projectR{}
		}
		foreign.R.DisconnectionPoints = append(foreign.R.DisconnectionPoints, object)
		return nil
	}

	for _, local := range slice {
		for _, foreign := range resultSlice {
			if local.ProjectID == foreign.ID {
				local.R.Project = foreign
				if foreign.R == nil {
					foreign.R = &projectR{}
				}
				foreign.R.DisconnectionPoints = append(foreign.R.DisconnectionPoints, local)
				break
			}
		}
	}

	return nil
}

// LoadString allows an eager lookup of values, cached into the
// loaded structs of the objects. This is for an N-1 relationship.
func (disconnectionPointL) LoadString(ctx context.Context, e boil.ContextExecutor, singular bool, maybeDisconnectionPoint interface{}, mods queries.Applicator) error {
	var slice []*DisconnectionPoint
	var object *DisconnectionPoint

	if singular {
		var ok bool
		object, ok = maybeDisconnectionPoint.(*DisconnectionPoint)
		if !ok {
			object = new(DisconnectionPoint)
			ok = queries.SetFromEmbeddedStruct(&object, &maybeDisconnectionPoint)
			if !ok {
				return errors.New(fmt.Sprintf("failed to set %T from embedded struct %T", object, maybeDisconnectionPoint))
			}
		}
	} else {
		s, ok := maybeDisconnectionPoint.(*[]*DisconnectionPoint)
		if ok {
			slice = *s
		} else {
			ok = queries.SetFromEmbeddedStruct(&slice, maybeDisconnectionPoint)
			if !ok {
				return errors.New(fmt.Sprintf("failed to set %T from embedded struct %T", slice, maybeDisconnectionPoint))
			}
		}
	}

	args := make([]interface{}, 0, 1)
	if singular {
		if object.R == nil {
			object.R = &disconnectionPointR{}
		}
		args = append(args, object.StringID)

	} else {
	Outer:
		for _, obj := range slice {
			if obj.R == nil {
				obj.R = &disconnectionPointR{}
			}

			for _, a := range args {
				if a == obj.StringID {
					continue Outer
				}
			}

			args = append(args, obj.StringID)

		}
	}

	if len(args) == 0 {
		return nil
	}

	query := NewQuery(
		qm.From(`strings`),
		qm.WhereIn(`strings.id in ?`, args...),
	)
	if mods != nil {
		mods.Apply(query)
	}

	results, err := query.QueryContext(ctx, e)
	if err != nil {
		return errors.Wrap(err, "failed to eager load String")
	}

	var resultSlice []*String
	if err = queries.Bind(results, &resultSlice); err != nil {
		return errors.Wrap(err, "failed to bind eager loaded slice String")
	}

	if err = results.Close(); err != nil {
		return errors.Wrap(err, "failed to close results of eager load for strings")
	}
	if err = results.Err(); err != nil {
		return errors.Wrap(err, "error occurred during iteration of eager loaded relations for strings")
	}

	if len(disconnectionPointAfterSelectHooks) != 0 {
		for _, obj := range resultSlice {
			if err := obj.doAfterSelectHooks(ctx, e); err != nil {
				return err
			}
		}
	}

	if len(resultSlice) == 0 {
		return nil
	}

	if singular {
		foreign := resultSlice[0]
		object.R.String = foreign
		if foreign.R == nil {
			foreign.R = &stringR{}
		}
		foreign.R.DisconnectionPoints = append(foreign.R.DisconnectionPoints, object)
		return nil
	}

	for _, local := range slice {
		for _, foreign := range resultSlice {
			if local.StringID == foreign.ID {
				local.R.String = foreign
				if foreign.R == nil {
					foreign.R = &stringR{}
				}
				foreign.R.DisconnectionPoints = append(foreign.R.DisconnectionPoints, local)
				break
			}
		}
	}

	return nil
}

// SetProject of the disconnectionPoint to the related item.
// Sets o.R.Project to related.
// Adds o to related.R.DisconnectionPoints.
func (o *DisconnectionPoint) SetProject(ctx context.Context, exec boil.ContextExecutor, insert bool, related *Project) error {
	var err error
	if insert {
		if err = related.Insert(ctx, exec, boil.Infer()); err != nil {
			return errors.Wrap(err, "failed to insert into foreign table")
		}
	}

	updateQuery := fmt.Sprintf(
		"UPDATE \"disconnection_points\" SET %s WHERE %s",
		strmangle.SetParamNames("\"", "\"", 1, []string{"project_id"}),
		strmangle.WhereClause("\"", "\"", 2, disconnectionPointPrimaryKeyColumns),
	)
	values := []interface{}{related.ID, o.ID}

	if boil.IsDebug(ctx) {
		writer := boil.DebugWriterFrom(ctx)
		fmt.Fprintln(writer, updateQuery)
		fmt.Fprintln(writer, values)
	}
	if _, err = exec.ExecContext(ctx, updateQuery, values...); err != nil {
		return errors.Wrap(err, "failed to update local table")
	}

	o.ProjectID = related.ID
	if o.R == nil {
		o.R = &disconnectionPointR{
			Project: related,
		}
	} else {
		o.R.Project = related
	}

	if related.R == nil {
		related.R = &projectR{
			DisconnectionPoints: DisconnectionPointSlice{o},
		}
	} else {
		related.R.DisconnectionPoints = append(related.R.DisconnectionPoints, o)
	}

	return nil
}

// SetString of the disconnectionPoint to the related item.
// Sets o.R.String to related.
// Adds o to related.R.DisconnectionPoints.
func (o *DisconnectionPoint) SetString(ctx context.Context, exec boil.ContextExecutor, insert bool, related *String) error {
	var err error
	if insert {
		if err = related.Insert(ctx, exec, boil.Infer()); err != nil {
			return errors.Wrap(err, "failed to insert into foreign table")
		}
	}

	updateQuery := fmt.Sprintf(
		"UPDATE \"disconnection_points\" SET %s WHERE %s",
		strmangle.SetParamNames("\"", "\"", 1, []string{"string_id"}),
		strmangle.WhereClause("\"", "\"", 2, disconnectionPointPrimaryKeyColumns),
	)
	values := []interface{}{related.ID, o.ID}

	if boil.IsDebug(ctx) {
		writer := boil.DebugWriterFrom(ctx)
		fmt.Fprintln(writer, updateQuery)
		fmt.Fprintln(writer, values)
	}
	if _, err = exec.ExecContext(ctx, updateQuery, values...); err != nil {
		return errors.Wrap(err, "failed to update local table")
	}

	o.StringID = related.ID
	if o.R == nil {
		o.R = &disconnectionPointR{
			String: related,
		}
	} else {
		o.R.String = related
	}

	if related.R == nil {
		related.R = &stringR{
			DisconnectionPoints: DisconnectionPointSlice{o},
		}
	} else {
		related.R.DisconnectionPoints = append(related.R.DisconnectionPoints, o)
	}

	return nil
}

// DisconnectionPoints retrieves all the records using an executor.
func DisconnectionPoints(mods ...qm.QueryMod) disconnectionPointQuery {
	mods = append(mods, qm.From("\"disconnection_points\""))
	q := NewQuery(mods...)
	if len(queries.GetSelect(q)) == 0 {
		queries.SetSelect(q, []string{"\"disconnection_points\".*"})
	}

	return disconnectionPointQuery{q}
}

// FindDisconnectionPoint retrieves a single record by ID with an executor.
// If selectCols is empty Find will return all columns.
func FindDisconnectionPoint(ctx context.Context, exec boil.ContextExecutor, iD string, selectCols ...string) (*DisconnectionPoint, error) {
	disconnectionPointObj := &DisconnectionPoint{}

	sel := "*"
	if len(selectCols) > 0 {
		sel = strings.Join(strmangle.IdentQuoteSlice(dialect.LQ, dialect.RQ, selectCols), ",")
	}
	query := fmt.Sprintf(
		"select %s from \"disconnection_points\" where \"id\"=$1", sel,
	)

	q := queries.Raw(query, iD)

	err := q.Bind(ctx, exec, disconnectionPointObj)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, sql.ErrNoRows
		}
		return nil, errors.Wrap(err, "models: unable to select from disconnection_points")
	}

	if err = disconnectionPointObj.doAfterSelectHooks(ctx, exec); err != nil {
		return disconnectionPointObj, err
	}

	return disconnectionPointObj, nil
}

// Insert a single record using an executor.
// See boil.Columns.InsertColumnSet documentation to understand column list inference for inserts.
func (o *DisconnectionPoint) Insert(ctx context.Context, exec boil.ContextExecutor, columns boil.Columns) error {
	if o == nil {
		return errors.New("models: no disconnection_points provided for insertion")
	}

	var err error

	if err := o.doBeforeInsertHooks(ctx, exec); err != nil {
		return err
	}

	nzDefaults := queries.NonZeroDefaultSet(disconnectionPointColumnsWithDefault, o)

	key := makeCacheKey(columns, nzDefaults)
	disconnectionPointInsertCacheMut.RLock()
	cache, cached := disconnectionPointInsertCache[key]
	disconnectionPointInsertCacheMut.RUnlock()

	if !cached {
		wl, returnColumns := columns.InsertColumnSet(
			disconnectionPointAllColumns,
			disconnectionPointColumnsWithDefault,
			disconnectionPointColumnsWithoutDefault,
			nzDefaults,
		)

		cache.valueMapping, err = queries.BindMapping(disconnectionPointType, disconnectionPointMapping, wl)
		if err != nil {
			return err
		}
		cache.retMapping, err = queries.BindMapping(disconnectionPointType, disconnectionPointMapping, returnColumns)
		if err != nil {
			return err
		}
		if len(wl) != 0 {
			cache.query = fmt.Sprintf("INSERT INTO \"disconnection_points\" (\"%s\") %%sVALUES (%s)%%s", strings.Join(wl, "\",\""), strmangle.Placeholders(dialect.UseIndexPlaceholders, len(wl), 1, 1))
		} else {
			cache.query = "INSERT INTO \"disconnection_points\" %sDEFAULT VALUES%s"
		}

		var queryOutput, queryReturning string

		if len(cache.retMapping) != 0 {
			queryReturning = fmt.Sprintf(" RETURNING \"%s\"", strings.Join(returnColumns, "\",\""))
		}

		cache.query = fmt.Sprintf(cache.query, queryOutput, queryReturning)
	}

	value := reflect.Indirect(reflect.ValueOf(o))
	vals := queries.ValuesFromMapping(value, cache.valueMapping)

	if boil.IsDebug(ctx) {
		writer := boil.DebugWriterFrom(ctx)
		fmt.Fprintln(writer, cache.query)
		fmt.Fprintln(writer, vals)
	}

	if len(cache.retMapping) != 0 {
		err = exec.QueryRowContext(ctx, cache.query, vals...).Scan(queries.PtrsFromMapping(value, cache.retMapping)...)
	} else {
		_, err = exec.ExecContext(ctx, cache.query, vals...)
	}

	if err != nil {
		return errors.Wrap(err, "models: unable to insert into disconnection_points")
	}

	if !cached {
		disconnectionPointInsertCacheMut.Lock()
		disconnectionPointInsertCache[key] = cache
		disconnectionPointInsertCacheMut.Unlock()
	}

	return o.doAfterInsertHooks(ctx, exec)
}

// Update uses an executor to update the DisconnectionPoint.
// See boil.Columns.UpdateColumnSet documentation to understand column list inference for updates.
// Update does not automatically update the record in case of default values. Use .Reload() to refresh the records.
func (o *DisconnectionPoint) Update(ctx context.Context, exec boil.ContextExecutor, columns boil.Columns) (int64, error) {
	var err error
	if err = o.doBeforeUpdateHooks(ctx, exec); err != nil {
		return 0, err
	}
	key := makeCacheKey(columns, nil)
	disconnectionPointUpdateCacheMut.RLock()
	cache, cached := disconnectionPointUpdateCache[key]
	disconnectionPointUpdateCacheMut.RUnlock()

	if !cached {
		wl := columns.UpdateColumnSet(
			disconnectionPointAllColumns,
			disconnectionPointPrimaryKeyColumns,
		)

		if !columns.IsWhitelist() {
			wl = strmangle.SetComplement(wl, []string{"created_at"})
		}
		if len(wl) == 0 {
			return 0, errors.New("models: unable to update disconnection_points, could not build whitelist")
		}

		cache.query = fmt.Sprintf("UPDATE \"disconnection_points\" SET %s WHERE %s",
			strmangle.SetParamNames("\"", "\"", 1, wl),
			strmangle.WhereClause("\"", "\"", len(wl)+1, disconnectionPointPrimaryKeyColumns),
		)
		cache.valueMapping, err = queries.BindMapping(disconnectionPointType, disconnectionPointMapping, append(wl, disconnectionPointPrimaryKeyColumns...))
		if err != nil {
			return 0, err
		}
	}

	values := queries.ValuesFromMapping(reflect.Indirect(reflect.ValueOf(o)), cache.valueMapping)

	if boil.IsDebug(ctx) {
		writer := boil.DebugWriterFrom(ctx)
		fmt.Fprintln(writer, cache.query)
		fmt.Fprintln(writer, values)
	}
	var result sql.Result
	result, err = exec.ExecContext(ctx, cache.query, values...)
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to update disconnection_points row")
	}

	rowsAff, err := result.RowsAffected()
	if err != nil {
		return 0, errors.Wrap(err, "models: failed to get rows affected by update for disconnection_points")
	}

	if !cached {
		disconnectionPointUpdateCacheMut.Lock()
		disconnectionPointUpdateCache[key] = cache
		disconnectionPointUpdateCacheMut.Unlock()
	}

	return rowsAff, o.doAfterUpdateHooks(ctx, exec)
}

// UpdateAll updates all rows with the specified column values.
func (q disconnectionPointQuery) UpdateAll(ctx context.Context, exec boil.ContextExecutor, cols M) (int64, error) {
	queries.SetUpdate(q.Query, cols)

	result, err := q.Query.ExecContext(ctx, exec)
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to update all for disconnection_points")
	}

	rowsAff, err := result.RowsAffected()
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to retrieve rows affected for disconnection_points")
	}

	return rowsAff, nil
}

// UpdateAll updates all rows with the specified column values, using an executor.
func (o DisconnectionPointSlice) UpdateAll(ctx context.Context, exec boil.ContextExecutor, cols M) (int64, error) {
	ln := int64(len(o))
	if ln == 0 {
		return 0, nil
	}

	if len(cols) == 0 {
		return 0, errors.New("models: update all requires at least one column argument")
	}

	colNames := make([]string, len(cols))
	args := make([]interface{}, len(cols))

	i := 0
	for name, value := range cols {
		colNames[i] = name
		args[i] = value
		i++
	}

	// Append all of the primary key values for each column
	for _, obj := range o {
		pkeyArgs := queries.ValuesFromMapping(reflect.Indirect(reflect.ValueOf(obj)), disconnectionPointPrimaryKeyMapping)
		args = append(args, pkeyArgs...)
	}

	sql := fmt.Sprintf("UPDATE \"disconnection_points\" SET %s WHERE %s",
		strmangle.SetParamNames("\"", "\"", 1, colNames),
		strmangle.WhereClauseRepeated(string(dialect.LQ), string(dialect.RQ), len(colNames)+1, disconnectionPointPrimaryKeyColumns, len(o)))

	if boil.IsDebug(ctx) {
		writer := boil.DebugWriterFrom(ctx)
		fmt.Fprintln(writer, sql)
		fmt.Fprintln(writer, args...)
	}
	result, err := exec.ExecContext(ctx, sql, args...)
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to update all in disconnectionPoint slice")
	}

	rowsAff, err := result.RowsAffected()
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to retrieve rows affected all in update all disconnectionPoint")
	}
	return rowsAff, nil
}

// Upsert attempts an insert using an executor, and does an update or ignore on conflict.
// See boil.Columns documentation for how to properly use updateColumns and insertColumns.
func (o *DisconnectionPoint) Upsert(ctx context.Context, exec boil.ContextExecutor, updateOnConflict bool, conflictColumns []string, updateColumns, insertColumns boil.Columns) error {
	if o == nil {
		return errors.New("models: no disconnection_points provided for upsert")
	}

	if err := o.doBeforeUpsertHooks(ctx, exec); err != nil {
		return err
	}

	nzDefaults := queries.NonZeroDefaultSet(disconnectionPointColumnsWithDefault, o)

	// Build cache key in-line uglily - mysql vs psql problems
	buf := strmangle.GetBuffer()
	if updateOnConflict {
		buf.WriteByte('t')
	} else {
		buf.WriteByte('f')
	}
	buf.WriteByte('.')
	for _, c := range conflictColumns {
		buf.WriteString(c)
	}
	buf.WriteByte('.')
	buf.WriteString(strconv.Itoa(updateColumns.Kind))
	for _, c := range updateColumns.Cols {
		buf.WriteString(c)
	}
	buf.WriteByte('.')
	buf.WriteString(strconv.Itoa(insertColumns.Kind))
	for _, c := range insertColumns.Cols {
		buf.WriteString(c)
	}
	buf.WriteByte('.')
	for _, c := range nzDefaults {
		buf.WriteString(c)
	}
	key := buf.String()
	strmangle.PutBuffer(buf)

	disconnectionPointUpsertCacheMut.RLock()
	cache, cached := disconnectionPointUpsertCache[key]
	disconnectionPointUpsertCacheMut.RUnlock()

	var err error

	if !cached {
		insert, ret := insertColumns.InsertColumnSet(
			disconnectionPointAllColumns,
			disconnectionPointColumnsWithDefault,
			disconnectionPointColumnsWithoutDefault,
			nzDefaults,
		)

		update := updateColumns.UpdateColumnSet(
			disconnectionPointAllColumns,
			disconnectionPointPrimaryKeyColumns,
		)

		if updateOnConflict && len(update) == 0 {
			return errors.New("models: unable to upsert disconnection_points, could not build update column list")
		}

		conflict := conflictColumns
		if len(conflict) == 0 {
			conflict = make([]string, len(disconnectionPointPrimaryKeyColumns))
			copy(conflict, disconnectionPointPrimaryKeyColumns)
		}
		cache.query = buildUpsertQueryPostgres(dialect, "\"disconnection_points\"", updateOnConflict, ret, update, conflict, insert)

		cache.valueMapping, err = queries.BindMapping(disconnectionPointType, disconnectionPointMapping, insert)
		if err != nil {
			return err
		}
		if len(ret) != 0 {
			cache.retMapping, err = queries.BindMapping(disconnectionPointType, disconnectionPointMapping, ret)
			if err != nil {
				return err
			}
		}
	}

	value := reflect.Indirect(reflect.ValueOf(o))
	vals := queries.ValuesFromMapping(value, cache.valueMapping)
	var returns []interface{}
	if len(cache.retMapping) != 0 {
		returns = queries.PtrsFromMapping(value, cache.retMapping)
	}

	if boil.IsDebug(ctx) {
		writer := boil.DebugWriterFrom(ctx)
		fmt.Fprintln(writer, cache.query)
		fmt.Fprintln(writer, vals)
	}
	if len(cache.retMapping) != 0 {
		err = exec.QueryRowContext(ctx, cache.query, vals...).Scan(returns...)
		if errors.Is(err, sql.ErrNoRows) {
			err = nil // Postgres doesn't return anything when there's no update
		}
	} else {
		_, err = exec.ExecContext(ctx, cache.query, vals...)
	}
	if err != nil {
		return errors.Wrap(err, "models: unable to upsert disconnection_points")
	}

	if !cached {
		disconnectionPointUpsertCacheMut.Lock()
		disconnectionPointUpsertCache[key] = cache
		disconnectionPointUpsertCacheMut.Unlock()
	}

	return o.doAfterUpsertHooks(ctx, exec)
}

// Delete deletes a single DisconnectionPoint record with an executor.
// Delete will match against the primary key column to find the record to delete.
func (o *DisconnectionPoint) Delete(ctx context.Context, exec boil.ContextExecutor) (int64, error) {
	if o == nil {
		return 0, errors.New("models: no DisconnectionPoint provided for delete")
	}

	if err := o.doBeforeDeleteHooks(ctx, exec); err != nil {
		return 0, err
	}

	args := queries.ValuesFromMapping(reflect.Indirect(reflect.ValueOf(o)), disconnectionPointPrimaryKeyMapping)
	sql := "DELETE FROM \"disconnection_points\" WHERE \"id\"=$1"

	if boil.IsDebug(ctx) {
		writer := boil.DebugWriterFrom(ctx)
		fmt.Fprintln(writer, sql)
		fmt.Fprintln(writer, args...)
	}
	result, err := exec.ExecContext(ctx, sql, args...)
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to delete from disconnection_points")
	}

	rowsAff, err := result.RowsAffected()
	if err != nil {
		return 0, errors.Wrap(err, "models: failed to get rows affected by delete for disconnection_points")
	}

	if err := o.doAfterDeleteHooks(ctx, exec); err != nil {
		return 0, err
	}

	return rowsAff, nil
}

// DeleteAll deletes all matching rows.
func (q disconnectionPointQuery) DeleteAll(ctx context.Context, exec boil.ContextExecutor) (int64, error) {
	if q.Query == nil {
		return 0, errors.New("models: no disconnectionPointQuery provided for delete all")
	}

	queries.SetDelete(q.Query)

	result, err := q.Query.ExecContext(ctx, exec)
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to delete all from disconnection_points")
	}

	rowsAff, err := result.RowsAffected()
	if err != nil {
		return 0, errors.Wrap(err, "models: failed to get rows affected by deleteall for disconnection_points")
	}

	return rowsAff, nil
}

// DeleteAll deletes all rows in the slice, using an executor.
func (o DisconnectionPointSlice) DeleteAll(ctx context.Context, exec boil.ContextExecutor) (int64, error) {
	if len(o) == 0 {
		return 0, nil
	}

	if len(disconnectionPointBeforeDeleteHooks) != 0 {
		for _, obj := range o {
			if err := obj.doBeforeDeleteHooks(ctx, exec); err != nil {
				return 0, err
			}
		}
	}

	var args []interface{}
	for _, obj := range o {
		pkeyArgs := queries.ValuesFromMapping(reflect.Indirect(reflect.ValueOf(obj)), disconnectionPointPrimaryKeyMapping)
		args = append(args, pkeyArgs...)
	}

	sql := "DELETE FROM \"disconnection_points\" WHERE " +
		strmangle.WhereClauseRepeated(string(dialect.LQ), string(dialect.RQ), 1, disconnectionPointPrimaryKeyColumns, len(o))

	if boil.IsDebug(ctx) {
		writer := boil.DebugWriterFrom(ctx)
		fmt.Fprintln(writer, sql)
		fmt.Fprintln(writer, args)
	}
	result, err := exec.ExecContext(ctx, sql, args...)
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to delete all from disconnectionPoint slice")
	}

	rowsAff, err := result.RowsAffected()
	if err != nil {
		return 0, errors.Wrap(err, "models: failed to get rows affected by deleteall for disconnection_points")
	}

	if len(disconnectionPointAfterDeleteHooks) != 0 {
		for _, obj := range o {
			if err := obj.doAfterDeleteHooks(ctx, exec); err != nil {
				return 0, err
			}
		}
	}

	return rowsAff, nil
}

// Reload refetches the object from the database
// using the primary keys with an executor.
func (o *DisconnectionPoint) Reload(ctx context.Context, exec boil.ContextExecutor) error {
	ret, err := FindDisconnectionPoint(ctx, exec, o.ID)
	if err != nil {
		return err
	}

	*o = *ret
	return nil
}

// ReloadAll refetches every row with matching primary key column values
// and overwrites the original object slice with the newly updated slice.
func (o *DisconnectionPointSlice) ReloadAll(ctx context.Context, exec boil.ContextExecutor) error {
	if o == nil || len(*o) == 0 {
		return nil
	}

	slice := DisconnectionPointSlice{}
	var args []interface{}
	for _, obj := range *o {
		pkeyArgs := queries.ValuesFromMapping(reflect.Indirect(reflect.ValueOf(obj)), disconnectionPointPrimaryKeyMapping)
		args = append(args, pkeyArgs...)
	}

	sql := "SELECT \"disconnection_points\".* FROM \"disconnection_points\" WHERE " +
		strmangle.WhereClauseRepeated(string(dialect.LQ), string(dialect.RQ), 1, disconnectionPointPrimaryKeyColumns, len(*o))

	q := queries.Raw(sql, args...)

	err := q.Bind(ctx, exec, &slice)
	if err != nil {
		return errors.Wrap(err, "models: unable to reload all in DisconnectionPointSlice")
	}

	*o = slice

	return nil
}

// DisconnectionPointExists checks if the DisconnectionPoint row exists.
func DisconnectionPointExists(ctx context.Context, exec boil.ContextExecutor, iD string) (bool, error) {
	var exists bool
	sql := "select exists(select 1 from \"disconnection_points\" where \"id\"=$1 limit 1)"

	if boil.IsDebug(ctx) {
		writer := boil.DebugWriterFrom(ctx)
		fmt.Fprintln(writer, sql)
		fmt.Fprintln(writer, iD)
	}
	row := exec.QueryRowContext(ctx, sql, iD)

	err := row.Scan(&exists)
	if err != nil {
		return false, errors.Wrap(err, "models: unable to check if disconnection_points exists")
	}

	return exists, nil
}