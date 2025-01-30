"""first notebooks migration

Revision ID: 1f66c9bce22e
Revises: ffdc0a98111c
Create Date: 2025-01-29 19:43:54.500676

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1f66c9bce22e'
down_revision = 'ffdc0a98111c'
branch_labels = None
depends_on = None


def upgrade():
    # Step 1: Add the columns as nullable
    op.add_column('users', sa.Column('first_name', sa.String(length=40), nullable=True))
    op.add_column('users', sa.Column('last_name', sa.String(length=40), nullable=True))

    # Step 2: Populate the columns with default values (e.g., 'Unknown')
    op.execute("UPDATE users SET first_name = 'Unknown' WHERE first_name IS NULL")
    op.execute("UPDATE users SET last_name = 'Unknown' WHERE last_name IS NULL")

    # Step 3: Alter the columns to NOT NULL
    op.alter_column('users', 'first_name', nullable=False)
    op.alter_column('users', 'last_name', nullable=False)


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('last_name')
        batch_op.drop_column('first_name')

    # ### end Alembic commands ###
