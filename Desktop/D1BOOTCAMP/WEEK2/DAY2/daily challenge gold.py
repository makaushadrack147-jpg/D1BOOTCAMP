import random


# Parent class
class Gene:
    def __init__(self, value=None):
        if value is None:
            self.value = random.randint(0, 1)
        else:
            self.value = value

    def mutate(self):
        # Flip the gene
        self.value = 1 - self.value

    def __str__(self):
        return str(self.value)


# Chromosome is made of Genes
class Chromosome(Gene):
    def __init__(self):
        self.genes = [Gene() for _ in range(10)]

    def mutate(self):
        # Randomly mutate each gene with a 50% chance
        for gene in self.genes:
            if random.random() < 0.5:
                gene.mutate()

    def __str__(self):
        return "".join(str(gene) for gene in self.genes)


# DNA is made of Chromosomes
class DNA(Chromosome):
    def __init__(self):
        self.chromosomes = [Chromosome() for _ in range(10)]

    def mutate(self):
        # Randomly mutate each chromosome with a 50% chance
        for chromosome in self.chromosomes:
            if random.random() < 0.5:
                chromosome.mutate()

    def is_all_ones(self):
        return all(
            gene.value == 1
            for chromosome in self.chromosomes
            for gene in chromosome.genes
        )

    def __str__(self):
        return "\n".join(str(chromosome) for chromosome in self.chromosomes)


# Organism contains DNA and an environment
class Organism:
    def __init__(self, dna, environment):
        self.dna = dna
        self.environment = environment

    def mutate(self):
        # Environment determines the probability of mutation
        if random.random() < self.environment:
            self.dna.mutate()


# Create organisms
organisms = [
    Organism(DNA(), environment=0.5)
    for _ in range(10)
]

generation = 0

while True:
    generation += 1

    for organism in organisms:
        organism.mutate()

        if organism.dna.is_all_ones():
            print("Organism reached all 1s!")
            print("Generations:", generation)
            print("\nFinal DNA:")
            print(organism.dna)
            break
    else:
        continue

    break