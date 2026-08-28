import networkx as nx

class RelationshipEngine:
    def __init__(self, db_conn):
        self.conn = db_conn

    def _build_graph(self):
        G = nx.Graph()
        cursor = self.conn.cursor()
        
        # Users
        cursor.execute("SELECT id FROM users")
        for (uid,) in cursor.fetchall():
            G.add_node(uid, type="USER")
            
        # Beneficiaries
        cursor.execute("SELECT id FROM beneficiaries")
        for (bid,) in cursor.fetchall():
            G.add_node(bid, type="BENEFICIARY")
            
        # Historical Transactions (User -> Account -> Ben)
        cursor.execute("""
            SELECT u.id, b.id 
            FROM transactions t
            JOIN accounts a ON t.account_id = a.id
            JOIN users u ON a.user_id = u.id
            JOIN beneficiaries b ON t.beneficiary_id = b.id
        """)
        for uid, bid in cursor.fetchall():
            G.add_edge(uid, bid, relation="PAID")
            
        return G

    def calculate_risk(self, user_id: str, target_id: str) -> float:
        # Check if target_id (e.g. beneficiary) has prior path to user_id
        if not target_id:
            return 0.0
            
        G = self._build_graph()
        if not G.has_node(user_id) or not G.has_node(target_id):
            return 50.0
            
        if not nx.has_path(G, user_id, target_id):
            return 60.0 # No prior connection
            
        path_length = nx.shortest_path_length(G, user_id, target_id)
        if path_length > 2:
            return 30.0 # Indirect connection
            
        return 0.0
