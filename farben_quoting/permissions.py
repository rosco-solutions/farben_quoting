# In your_custom_app/permissions.py
import frappe

def get_communication_permissions(user=None):
    """
    1. Administrator sees everything.
    2. Standard users see emails they own/created.
    3. Standard users can see emails linked to any DocType they have Read access to.
    """
    if not user:
        user = frappe.session.user

    # Root admin bypasses all restrictions
    if user == "Administrator":
        return ""

    # 1. Base condition: User can always see their own communications
    conditions = [f"`tabCommunication`.owner = '{user}'"]

    # 2. Add bypass for standard system Comments so timelines don't break
    conditions.append("`tabCommunication`.communication_type = 'Comment'")

    # 3. Dynamic check: Find DocTypes the user has explicit permission to read
    readable_doctypes = []
    
    # Get all DocTypes in the system to check permissions against
    all_doctypes = frappe.get_all("DocType", filters={"istable": 0}, pluck="name")
    
    for dt in all_doctypes:
        # Check if the current user has "Read" rights to this document type
        if frappe.has_permission(dt, "read", user=user):
            # Escape strings safely for SQL insertion
            readable_doctypes.append(frappe.db.escape(dt))

    # If the user can read any DocTypes, allow them to see communications linked to them
    if readable_doctypes:
        doctype_list = ", ".join(readable_doctypes)
        conditions.append(f"`tabCommunication`.reference_doctype IN ({doctype_list})")

    # Join all conditions with an OR statement so fulfilling ANY condition grants visibility
    return f"({' OR '.join(conditions)})"
