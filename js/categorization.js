// ========================================
// SISTEMA DE CATEGORIZACIÓN AUTOMÁTICA
// ========================================

class CategorizationEngine {
    constructor() {
        this.rules = this.initializeRules();
        this.userPatterns = this.loadUserPatterns();
    }

    initializeRules() {
        return {
            // Palabras clave para cada categoría
            alimentacion: [
                'supermercado', 'comida', 'restaurante', 'café', 'desayuno', 'almuerzo', 'cena',
                'grocery', 'food', 'restaurant', 'cafe', 'lunch', 'dinner', 'breakfast',
                'mercado', 'panadería', 'carnicería', 'frutería', 'pescadería', 'charcutería',
                'delivery', 'domicilio', 'uber eats', 'glovo', 'just eat', 'rappi',
                'mcdonalds', 'burger king', 'kfc', 'pizza', 'pizzeria', 'kebab',
                'starbucks', 'tim hortons', 'costa coffee', 'nespresso'
            ],
            transporte: [
                'gasolina', 'gas', 'combustible', 'estacionamiento', 'parking', 'metro',
                'autobús', 'bus', 'taxi', 'uber', 'cabify', 'bolt', 'lyft',
                'tren', 'renfe', 'ave', 'cercanías', 'bicicleta', 'bike', 'scooter',
                'peaje', 'toll', 'mantenimiento', 'taller', 'neumáticos', 'neumaticos',
                'seguro coche', 'seguro auto', 'itv', 'revision', 'aceite', 'filtro',
                'vuelo', 'avión', 'avion', 'billete', 'ticket', 'billete tren'
            ],
            entretenimiento: [
                'cine', 'película', 'pelicula', 'movie', 'teatro', 'concierto', 'música',
                'música', 'spotify', 'netflix', 'disney', 'amazon prime', 'hbo',
                'videojuego', 'juego', 'game', 'playstation', 'xbox', 'nintendo',
                'bar', 'pub', 'discoteca', 'club', 'fiesta', 'party', 'alcohol',
                'deporte', 'gimnasio', 'gym', 'fitness', 'yoga', 'pilates',
                'libro', 'book', 'revista', 'magazine', 'museo', 'exposición'
            ],
            salud: [
                'farmacia', 'medicina', 'medicamento', 'doctor', 'médico', 'medico',
                'hospital', 'clínica', 'clinica', 'dentista', 'odontólogo', 'odontologo',
                'óptica', 'optica', 'gafas', 'lentes', 'seguro médico', 'seguro medico',
                'psicólogo', 'psicologo', 'terapia', 'masaje', 'fisioterapia',
                'laboratorio', 'análisis', 'analisis', 'radiografía', 'radiografia',
                'vacuna', 'vacunación', 'vacunacion', 'emergencia', 'urgencia'
            ],
            educacion: [
                'universidad', 'colegio', 'escuela', 'curso', 'formación', 'formacion',
                'libro', 'textbook', 'material', 'matrícula', 'matricula', 'tuition',
                'beca', 'scholarship', 'examen', 'certificación', 'certificacion',
                'idioma', 'language', 'inglés', 'ingles', 'francés', 'frances',
                'máster', 'master', 'doctorado', 'phd', 'investigación', 'investigacion'
            ],
            vivienda: [
                'alquiler', 'rent', 'hipoteca', 'mortgage', 'electricidad', 'luz',
                'agua', 'gas', 'internet', 'wifi', 'telefonía', 'telefonia',
                'seguro hogar', 'seguro casa', 'reparación', 'reparacion', 'mantenimiento',
                'muebles', 'furniture', 'electrodomésticos', 'electrodomesticos',
                'decoración', 'decoracion', 'jardín', 'jardin', 'limpieza',
                'comunidad', 'portero', 'ascensor', 'garaje', 'parking'
            ],
            otros: [
                'regalo', 'gift', 'donación', 'donacion', 'caridad', 'charity',
                'multa', 'fine', 'penalización', 'penalizacion', 'comisión', 'comision',
                'transferencia', 'transfer', 'pago', 'payment', 'factura', 'bill',
                'suscripción', 'suscripcion', 'subscription', 'membresía', 'membresia',
                'impuesto', 'tax', 'iva', 'irpf', 'seguridad social'
            ]
        };
    }

    loadUserPatterns() {
        const saved = localStorage.getItem('veedorUserPatterns');
        return saved ? JSON.parse(saved) : {};
    }

    saveUserPatterns() {
        localStorage.setItem('veedorUserPatterns', JSON.stringify(this.userPatterns));
    }

    categorizeTransaction(description, amount = 0) {
        const desc = description.toLowerCase().trim();
        
        // Buscar coincidencias exactas primero
        for (const [category, keywords] of Object.entries(this.rules)) {
            for (const keyword of keywords) {
                if (desc.includes(keyword.toLowerCase())) {
                    this.learnFromUser(description, category);
                    return category;
                }
            }
        }

        // Buscar patrones del usuario
        const userCategory = this.findUserPattern(desc);
        if (userCategory) {
            return userCategory;
        }

        // Categorización por monto (reglas heurísticas)
        const amountCategory = this.categorizeByAmount(amount);
        if (amountCategory) {
            return amountCategory;
        }

        // Categorización por palabras similares (fuzzy matching)
        const fuzzyCategory = this.fuzzyMatch(desc);
        if (fuzzyCategory) {
            return fuzzyCategory;
        }

        // Por defecto, categoría "otros"
        return 'otros';
    }

    findUserPattern(description) {
        for (const [pattern, category] of Object.entries(this.userPatterns)) {
            if (description.includes(pattern.toLowerCase())) {
                return category;
            }
        }
        return null;
    }

    categorizeByAmount(amount) {
        // Reglas heurísticas basadas en montos típicos
        if (amount >= 50 && amount <= 200) {
            return 'alimentacion'; // Compras de supermercado típicas
        } else if (amount >= 20 && amount <= 80) {
            return 'transporte'; // Gasolina o transporte público
        } else if (amount >= 100 && amount <= 500) {
            return 'vivienda'; // Servicios del hogar
        } else if (amount >= 10 && amount <= 50) {
            return 'entretenimiento'; // Gastos de ocio pequeños
        }
        return null;
    }

    fuzzyMatch(description) {
        const words = description.split(' ');
        const categoryScores = {};

        for (const [category, keywords] of Object.entries(this.rules)) {
            categoryScores[category] = 0;
            
            for (const word of words) {
                for (const keyword of keywords) {
                    const similarity = this.calculateSimilarity(word, keyword);
                    if (similarity > 0.6) {
                        categoryScores[category] += similarity;
                    }
                }
            }
        }

        // Encontrar la categoría con mayor puntuación
        const bestCategory = Object.entries(categoryScores)
            .sort(([,a], [,b]) => b - a)[0];

        return bestCategory && bestCategory[1] > 0 ? bestCategory[0] : null;
    }

    calculateSimilarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 1.0;
        
        const distance = this.levenshteinDistance(longer, shorter);
        return (longer.length - distance) / longer.length;
    }

    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    learnFromUser(description, category) {
        // Extraer palabras clave de la descripción
        const words = description.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(' ')
            .filter(word => word.length > 3);

        // Agregar patrones del usuario
        words.forEach(word => {
            if (!this.userPatterns[word]) {
                this.userPatterns[word] = category;
            }
        });

        this.saveUserPatterns();
    }

    suggestCategory(description) {
        const category = this.categorizeTransaction(description);
        const confidence = this.calculateConfidence(description, category);
        
        return {
            category,
            confidence,
            alternatives: this.getAlternativeCategories(description)
        };
    }

    calculateConfidence(description, category) {
        const desc = description.toLowerCase();
        let score = 0;
        let totalKeywords = 0;

        for (const keyword of this.rules[category] || []) {
            totalKeywords++;
            if (desc.includes(keyword.toLowerCase())) {
                score++;
            }
        }

        // También considerar patrones del usuario
        for (const [pattern, cat] of Object.entries(this.userPatterns)) {
            if (cat === category && desc.includes(pattern.toLowerCase())) {
                score += 0.5;
                totalKeywords += 0.5;
            }
        }

        return totalKeywords > 0 ? Math.min(score / totalKeywords, 1) : 0.3;
    }

    getAlternativeCategories(description) {
        const desc = description.toLowerCase();
        const alternatives = [];

        for (const [category, keywords] of Object.entries(this.rules)) {
            let score = 0;
            for (const keyword of keywords) {
                if (desc.includes(keyword.toLowerCase())) {
                    score++;
                }
            }
            if (score > 0) {
                alternatives.push({
                    category,
                    score: score / keywords.length
                });
            }
        }

        return alternatives
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(alt => alt.category);
    }

    addCustomRule(category, keywords) {
        if (!this.rules[category]) {
            this.rules[category] = [];
        }
        
        const newKeywords = Array.isArray(keywords) ? keywords : [keywords];
        this.rules[category].push(...newKeywords);
        
        // Guardar reglas personalizadas
        localStorage.setItem('veedorCustomRules', JSON.stringify(this.rules));
    }

    getCategorySuggestions(partialDescription) {
        if (partialDescription.length < 2) return [];

        const suggestions = [];
        const desc = partialDescription.toLowerCase();

        for (const [category, keywords] of Object.entries(this.rules)) {
            const matchingKeywords = keywords.filter(keyword => 
                keyword.toLowerCase().includes(desc)
            );
            
            if (matchingKeywords.length > 0) {
                suggestions.push({
                    category,
                    keywords: matchingKeywords.slice(0, 3)
                });
            }
        }

        return suggestions.slice(0, 5);
    }
}

// Instancia global del motor de categorización
window.categorizationEngine = new CategorizationEngine();
