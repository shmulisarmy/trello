from collections import defaultdict
from edit_distance import edit_distance


class Tree:
    def __init__(self):
        self.root = defaultdict(dict)

    def insert(self, word: str):
        current = self.root
        for letter in word:
            current = current.setdefault(letter, {})
        current['contains_word'] = True
        current['word'] = word

    def search(self, search_term):
        current = self.root
        for letter in search_term:
            if letter not in current:
                break
            current = current[letter]
            if current.get('contains_word'):
                return current['word']

        # If exact match is not found, perform BFS for fuzzy matching
        queue = [current]
        while queue:
            node = queue.pop(0)
            if node.get('contains_word') and self.is_close_word(node['word'], search_term):
                return node['word']
            for key, child in node.items():
                if key not in {'contains_word', 'word'}:
                    queue.append(child)

        return None  # No close match found

    @staticmethod
    def is_close_word(word1, word2):
        return abs(len(word1) - len(word2)) < 2 and edit_distance(word1, word2) < 3


# Example Usage
tree = Tree()
tree.insert("cat")
tree.insert("bat")
tree.insert("rat")
tree.insert("log")

print(tree.search("ca"))  # Fuzzy match, should return "cat"
print(tree.search("bat"))  # Exact match, should return "bat"
print(tree.search("zat"))  # Fuzzy match, might return "rat"
print(tree.search("dog"))  # No match, should return None
