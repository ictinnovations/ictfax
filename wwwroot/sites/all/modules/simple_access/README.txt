------------------------------------------------------------------------------
  Simple Access Module for Drupal
    developed by: Jeff Robbins | jjeff | robbins (att) jjeff (d0t) com
------------------------------------------------------------------------------

After testing out most of Drupal's node-access modules, I found myself
frustrated with their tendency toward confusing user interfaces,
defaulting to hiding all nodes, or allowing me to inadvertently make
nodes editable or deletable by non-administrators.

Simple Access is an attempt to solve these problems with a focus on
simplicity and ease of use. This module provides an easy way to make
nodes accessible by only a group (or groups) of users. It defaults to
only managing access of viewability, so that administrators can simply
make some nodes "private". However, the module can also manage
editability and deleteability of nodes as well, allowing for nodes that
are editable by anyone in a certain role.

Access groups are based on roles. So for example, my site has roles
entitled "Coach Level 1", "Coach Level 2", and "Coach Level 3". I can
create an access group called "Coaches" and assign all of these roles to
it. Then when I assign a node to be viewable only by "Coaches", only
users who are a member of these roles will be able to view.

Nodes that are not assigned to any access groups will remain viewable by
all users, so all nodes will remain viewable when activating this
module. And nodes only become private when they are assigned to an
access group.




-------------------------------------------------------------------------
The following is an summation of an email exchange that sheds some light
on the way that simple_access works and how node access works in Drupal
in general.
-------------------------------------------------------------------------

On Jun 27, 2005, at 8:45 AM, David Norman wrote:

I'd like to try Simple Access. If I don't like it, does it make any
changes other than the two tables it comes with that I wouldn't like if
I decided to deactivate it?

Jeff Robbins wrote:

Yes it does. All modules that manage node access need to alter Drupal's
node_access table. They need to remove the entry that allows all users
to see all nodes. Many of those modules don't give you any control over
this, however simple_access allows you to add and remove the appropriate
stuff from the node_access table from its settings pages. So enabling
the module is a two step process: 1) enable the module in admin/modules,
and then 2) go to the simple access settings and enable the database.

To deactivate the module: 1) Go to simple_access settings and deactivate
the database, 2) disable the module in admin/modules. This should put
you back to where you were before you installed and all nodes should be
viewable.

-Jeff


On Jul 11, 2005, at 11:03 AM, David Norman wrote:

I put simple_access together with og.module (Organic Groups) and it
seems simple_access rights don't get enforced. I'm still investigating
it, but is there something you can think of that would cause that?


	From: 	  robbins@xxxxxxx
	Subject: 	Re: simple_access.module
	Date: 	July 11, 2005 12:43:50 PM EDT
	To: 	  deekayen@xxxxxx

Hi David,

Yeah, that's a tricky one. I haven't looked at how OG handles its node
access stuff. But this actually may be more of a core Drupal problem
than a problem with the modules.

Drupal doesn't handle the node access as restrictions, but rather as
"grants". And if any module grants access to view, edit, or delete a
node to a certain user, another module cannot take it away.

In order to
make simple_access "simple", it grants view access to all nodes when it
is enabled and access only becomes restricted (i.e. there is no 'grant'
for all users) when access groups are assigned to a node. It's
confusing, I know! The intent of this is to be able to enable
simple_access without needing to assign specific permissions to every
node in order to make them viewable. That is how most of the other
access modules work, and what happens is that all of your nodes "go
away" when you enable them.

So my guess is that simple_access' default view grant for all users is
in conflict with OG's tendency toward hiding all nodes. The only
workaround that I can think of for this is kind of dodgy:

1. Create a new user role without any users assigned to it. You could
call it 'nobody'. 2. Create an access group in simple_access called
'Nobody' and assign this role to it. 3. Select 'Only viewable by'
'nobody' for nodes that you want managed by Organic Groups.

This will remove simple_access' universal view grant for those nodes and
leave it up to OG to grant or deny access.

Although I have to admit that this solution makes simple_access look not
so simple anymore. :-)

-Jeff




