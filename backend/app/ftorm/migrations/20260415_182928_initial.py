"""
Migration script for initial.
"""

from ftorm.migrations.operations import Operations
from ftorm.migrations.schema import Schema
from ftorm.migrations.table import Table
from ftorm.migrations.column import Column

name = "initial"
version = "20260415_182928"
created_at = "2026-04-15T18:29:28.853523"
down_revision = ""
status = "pending"

operations = Operations.from_instances({  'create_table': [  Table('users', [Column(name='id', type='SERIAL', max_length=None, nullable=False, primary_key=True, unique=False, default=None), Column(name='username', type='VARCHAR', max_length=150, nullable=False, primary_key=False, unique=True, default=None), Column(name='first_name', type='VARCHAR', max_length=150, nullable=True, primary_key=False, unique=False, default=None), Column(name='last_name', type='VARCHAR', max_length=150, nullable=True, primary_key=False, unique=False, default=None), Column(name='email', type='VARCHAR', max_length=255, nullable=False, primary_key=False, unique=True, default=None), Column(name='password_hash', type='VARCHAR', max_length=255, nullable=False, primary_key=False, unique=False, default=None), Column(name='is_active', type='BOOLEAN', max_length=None, nullable=False, primary_key=False, unique=False, default={'kind': 'literal', 'value': False})])],
   'drop_table': [],
   'alter_table': []})

schema = Schema.from_dict({'users': {'table_name': 'users', 'columns': [{'name': 'id', 'type': 'SERIAL', 'max_length': None, 'nullable': False, 'primary_key': True, 'unique': False, 'default': None}, {'name': 'username', 'type': 'VARCHAR', 'max_length': 150, 'nullable': False, 'primary_key': False, 'unique': True, 'default': None}, {'name': 'first_name', 'type': 'VARCHAR', 'max_length': 150, 'nullable': True, 'primary_key': False, 'unique': False, 'default': None}, {'name': 'last_name', 'type': 'VARCHAR', 'max_length': 150, 'nullable': True, 'primary_key': False, 'unique': False, 'default': None}, {'name': 'email', 'type': 'VARCHAR', 'max_length': 255, 'nullable': False, 'primary_key': False, 'unique': True, 'default': None}, {'name': 'password_hash', 'type': 'VARCHAR', 'max_length': 255, 'nullable': False, 'primary_key': False, 'unique': False, 'default': None}, {'name': 'is_active', 'type': 'BOOLEAN', 'max_length': None, 'nullable': False, 'primary_key': False, 'unique': False, 'default': {'kind': 'literal', 'value': False}}]}})

def upgrade():
   operations.apply()