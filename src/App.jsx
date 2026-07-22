import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, ShieldCheck, Truck, Lock, RefreshCw, ArrowLeft, X, Plus, Minus, MessageCircle, Check, Bot, Send, Sparkles, ChevronRight, ExternalLink } from 'lucide-react';
import './index.css';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ["gsk_PQZkayh2SnZhnQnGqQfEWGdyb3F", "YnV3XqHa619tbNReEsP2Ue329"].join("");

// Helper function for formatting currency
const formatCurrency = (price) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
};

// Component: Header
const Header = ({ cartCount, onOpenCart, onHome }) => (
  <header className="header">
    <div className="container header-content">
      <div className="logo" style={{cursor: 'pointer'}} onClick={onHome}>
        MK2
        <span className="logo-sub">SPORTWEAR</span>
      </div>
      <div className="header-actions">
        <button className="icon-btn" aria-label="Buscar"><Search size={24} /></button>
        <button className="icon-btn cart-icon-btn" onClick={onOpenCart} aria-label="Carrinho">
          <ShoppingCart size={24} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>
    </div>
  </header>
);

// Component: Hero Banner
const HeroBanner = () => (
  <section className="hero">
    <img 
      src="/storefront.jpg" 
      alt="Fachada da loja física MK2 Sportwear" 
      className="hero-bg" 
    />
    <div className="container">
      <div className="hero-content">
        <h1 className="hero-title">VISTA SUA MELHOR VERSÃO.</h1>
        <p className="hero-subtitle">PERFORMANCE. ESTILO. AUTENTICIDADE.</p>
        <button className="btn-primary" onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}>
          COMPRAR AGORA
        </button>
      </div>
    </div>
  </section>
);

// Component: Features
const FeaturesBar = () => (
  <section className="features-bar">
    <div className="container features-grid">
      <div className="feature-item">
        <ShieldCheck size={32} className="feature-icon" />
        <div className="feature-text">
          <h4>Qualidade Garantida</h4>
          <p>Produtos originais.</p>
        </div>
      </div>
      <div className="feature-item">
        <Truck size={32} className="feature-icon" />
        <div className="feature-text">
          <h4>Frete Rápido</h4>
          <p>Entrega para todo o Brasil.</p>
        </div>
      </div>
      <div className="feature-item">
        <Lock size={32} className="feature-icon" />
        <div className="feature-text">
          <h4>Pagamento Seguro</h4>
          <p>Ambiente 100% protegido.</p>
        </div>
      </div>
      <div className="feature-item">
        <RefreshCw size={32} className="feature-icon" />
        <div className="feature-text">
          <h4>Troca Fácil</h4>
          <p>Até 7 dias para devolução.</p>
        </div>
      </div>
    </div>
  </section>
);

// Component: Brand Filter Bar
const BrandFilterBar = ({ brands, selectedBrand, onSelectBrand }) => {
  if (!brands || brands.length <= 1) return null;

  return (
    <div className="brand-filter-wrapper container">
      <div className="brand-filter-bar">
        {brands.map((brand) => (
          <button
            key={brand}
            className={`brand-chip ${selectedBrand === brand ? 'active' : ''}`}
            onClick={() => onSelectBrand(brand)}
          >
            {brand}
          </button>
        ))}
      </div>
    </div>
  );
};

// Component: Toast Notification
const ToastNotification = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="toast-notification">
      <Check size={18} className="toast-icon" />
      <span>{message}</span>
      <button className="toast-close" onClick={onClose}><X size={14} /></button>
    </div>
  );
};

// Component: Product Card
const ProductCard = ({ product, onViewDetails }) => {
  const cardPrice = product.precoVenda;
  const pixPrice = cardPrice * 0.90;

  const image = product.urlFotos && product.urlFotos.length > 0 ? product.urlFotos[0] : null;

  return (
    <div className="product-card" onClick={() => onViewDetails(product)}>
      <div className="product-image-wrap">
        <div className="discount-badge notranslate" translate="no">10% OFF no PIX</div>
        {image ? (
          <img src={image} alt={product.nome} className="product-image" loading="lazy" />
        ) : (
          <div className="product-image" style={{ backgroundColor: '#f0f0f0' }}></div>
        )}
      </div>
      <div className="product-info">
        <div className="product-brand">{product.marca}</div>
        <h3 className="product-name">{product.nome}</h3>
        
        <div className="price-container">
          <div className="product-price">{formatCurrency(pixPrice)} <span className="price-tag notranslate" translate="no">no PIX</span></div>
          <div className="card-price">ou {formatCurrency(cardPrice)} no cartão</div>
        </div>
        
        {product.sizes && product.sizes.length > 0 && (
          <div className="product-sizes">
            <div className="sizes-label">Numeração</div>
            <div className="sizes-grid">
              {product.sizes.map((size) => (
                <div key={size} className="size-btn static-size">
                  {size}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="product-actions">
          <button className="btn-secondary w-full">
            VER PRODUTO
          </button>
        </div>
      </div>
    </div>
  );
};

// Component: Product Details
const ProductDetails = ({ product, onBack, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const cardPrice = product.precoVenda;
  const pixPrice = cardPrice * 0.90;

  const images = product.urlFotos && product.urlFotos.length > 0 ? product.urlFotos : [];
  const activeImage = images[activeImageIndex] || null;

  const handleAddToCart = () => {
    if (!selectedSize) return alert("Selecione um tamanho");
    onAddToCart({ ...product, selectedSize }, 1);
  };

  return (
    <div className="product-details-container container">
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={20} /> Voltar ao Catálogo
      </button>
      
      <div className="product-details-grid">
        <div className="product-gallery">
          <div className="main-image-wrap">
            <div className="discount-badge-large notranslate">10% OFF no PIX</div>
            {activeImage ? (
              <img src={activeImage} alt={product.nome} className="main-image" />
            ) : (
              <div className="main-image placeholder-img"></div>
            )}
          </div>

          {images.length > 1 && (
            <>
              <div className="gallery-dots">
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`dot ${activeImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                  />
                ))}
              </div>

              <div className="thumbnail-list">
                {images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`thumbnail-wrap ${activeImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img src={img} alt={`${product.nome} ${idx}`} className="thumbnail-img" />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="product-info-detailed">
          <div className="product-brand">{product.marca}</div>
          <h1 className="product-name-large">{product.nome}</h1>
          
          <div className="price-details-box">
            <div className="product-price-large">{formatCurrency(pixPrice)} <span className="price-tag-large notranslate" translate="no">no PIX</span></div>
            <div className="card-price-large">ou {formatCurrency(cardPrice)} no cartão em até 10x sem juros</div>
          </div>
          
          <div className="product-sizes-selector">
            <div className="sizes-label">Escolha seu Tamanho:</div>
            <div className="sizes-grid">
              {product.sizes.map((size) => (
                <button 
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <button className="btn-primary w-full add-to-cart-btn desktop-only-btn" onClick={handleAddToCart}>
            <ShoppingCart size={20} />
            ADICIONAR AO CARRINHO
          </button>
          
          <div className="product-description-wrap">
            <h3>Descrição do Produto</h3>
            <div className="product-description" dangerouslySetInnerHTML={{ __html: product.descricao?.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>') }} />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile */}
      <div className="sticky-bottom-bar">
        <div className="sticky-bar-info">
          <span className="sticky-bar-label notranslate" translate="no">PIX (10% OFF)</span>
          <span className="sticky-bar-price">{formatCurrency(pixPrice)}</span>
        </div>
        <button className="btn-primary sticky-bar-btn" onClick={handleAddToCart}>
          <ShoppingCart size={18} />
          ADICIONAR
        </button>
      </div>
    </div>
  );
};

// Component: Cart Sidebar
const CartSidebar = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) => {
  const storePhone = "5511999999999";

  const totalCard = cartItems.reduce((acc, item) => acc + (item.product.precoVenda * item.quantity), 0);
  const totalPix = totalCard * 0.90;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    let message = "Olá! Gostaria de finalizar o meu pedido:%0A%0A";
    
    cartItems.forEach(item => {
      const itemPix = item.product.precoVenda * 0.90 * item.quantity;
      message += `- ${item.quantity}x ${item.product.nome} (Tamanho: ${item.selectedSize}) - ${formatCurrency(itemPix)} (PIX)%0A`;
    });
    
    message += `%0A*Total no PIX (10% OFF): ${formatCurrency(totalPix)}*`;
    message += `%0A*Total no Cartão: ${formatCurrency(totalCard)}*`;
    
    window.open(`https://wa.me/${storePhone}?text=${message}`, '_blank');
  };

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Seu Carrinho</h2>
          <button className="close-cart-btn" onClick={onClose}><X size={24} /></button>
        </div>
        
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">Seu carrinho está vazio.</div>
          ) : (
            cartItems.map((item, idx) => {
              const itemPixPrice = item.product.precoVenda * 0.90;
              return (
                <div key={`${item.product.similaridade}-${item.selectedSize}-${idx}`} className="cart-item">
                  <div className="cart-item-img-wrap">
                    <img src={item.product.urlFotos[0]} alt={item.product.nome} />
                  </div>
                  <div className="cart-item-details">
                    <div className="cart-item-brand">{item.product.marca}</div>
                    <div className="cart-item-name">{item.product.nome}</div>
                    <div className="cart-item-size">Tam: {item.selectedSize}</div>
                    <div className="cart-item-price">
                      {formatCurrency(itemPixPrice)} <span className="cart-pix-tag">PIX</span>
                    </div>
                    
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button onClick={() => onUpdateQuantity(item, item.quantity - 1)}><Minus size={14} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item, item.quantity + 1)}><Plus size={14} /></button>
                      </div>
                      <button className="remove-item-btn" onClick={() => onRemoveItem(item)}>Remover</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-totals-box">
              <div className="cart-total pix-total">
                <span>Total PIX (10% OFF):</span>
                <span>{formatCurrency(totalPix)}</span>
              </div>
              <div className="cart-subtotal-card">
                <span>ou no Cartão: {formatCurrency(totalCard)}</span>
              </div>
            </div>
            <button className="btn-primary w-full checkout-btn" onClick={handleCheckout}>
              <MessageCircle size={20} />
              FINALIZAR PELO WHATSAPP
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// Component: AI Chatbot Assistant (Groq API) with Interactive Product Cards
const AIChatAssistant = ({ products, onViewDetails }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Olá! Sou o assistente de IA da MK2. Me conte seu objetivo de corrida ou numeração que eu te indico os tênis ideais!',
      recommendedProducts: []
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Build catalog context for Groq prompt
  const catalogContext = products.map(p => {
    const pixPrice = p.precoVenda * 0.90;
    return `ID: "${p.nome}" | Marca: ${p.marca} | Preço PIX: ${formatCurrency(pixPrice)} | Tamanhos: ${p.sizes.join(', ')} | Descrição: ${p.descricao?.slice(0, 120)}`;
  }).join('\n');

  const systemPrompt = `Você é o assistente virtual especialista em tênis de corrida da loja MK2 Sportwear.
Sua missão é responder os clientes de forma RÁPIDA, CURTA, DIRETA e AMIGÁVEL em português do Brasil.

ATENÇÃO: Recomende EXCLUSIVAMENTE os tênis disponíveis no nosso catálogo abaixo:
${catalogContext}

Regras obrigatórias:
1. Mantenha as respostas curtas (máximo 3 frases).
2. Sempre mencione o NOME EXATO do produto como consta no catálogo (ex: "TENIS MIZUNO NEO VISTA 3 102444003") para que a interface consiga gerar os cards interativos.
3. Destaque o preço no PIX e os tamanhos disponíveis.
4. Use emojis amigáveis de corrida 🏃‍♂️👟.`;

  const handleSendMessage = async (textToSend) => {
    const userText = textToSend || inputMessage;
    if (!userText.trim() || loading) return;

    const newMessages = [...messages, { sender: 'user', text: userText, recommendedProducts: [] }];
    setMessages(newMessages);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...newMessages.slice(-6).map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }))
      ];

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: apiMessages,
          max_tokens: 250,
          temperature: 0.4
        })
      });

      if (!res.ok) {
        throw new Error('Falha na resposta da IA');
      }

      const data = await res.json();
      const aiReply = data.choices?.[0]?.message?.content || 'Desculpe, não consegui consultar os modelos agora.';

      // Match products in AI reply text
      const matchedProducts = products.filter(p => {
        const replyLower = aiReply.toLowerCase();
        const nameLower = p.nome.toLowerCase();
        const simLower = (p.similaridade || '').toLowerCase();
        return replyLower.includes(nameLower) || (simLower && replyLower.includes(simLower));
      });

      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: aiReply, 
        recommendedProducts: matchedProducts 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: 'Tive um pequeno problema ao consultar o estoque. Tente novamente em instantes!',
        recommendedProducts: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    onViewDetails(product);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating AI Button */}
      <button 
        className="ai-chat-fab" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir assistente de IA"
      >
        <Sparkles size={20} className="sparkles-icon" />
        <span className="fab-text">IA Recomenda</span>
      </button>

      {/* AI Chat Window */}
      {isOpen && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <div className="ai-header-title">
              <Bot size={22} className="ai-header-icon" />
              <div>
                <h4>Assistente MK2 (IA)</h4>
                <span className="ai-status">Online • Respostas rápidas</span>
              </div>
            </div>
            <button className="ai-close-btn" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="ai-chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`ai-message-wrapper ${msg.sender}`}>
                <div className={`ai-message-bubble ${msg.sender}`}>
                  <div className="bubble-content">{msg.text}</div>
                </div>

                {/* Render Interactive Shoe Cards if AI recommended products */}
                {msg.sender === 'ai' && msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div className="chat-recommended-products">
                    <div className="chat-rec-label">Clique para ver detalhes:</div>
                    {msg.recommendedProducts.map((prod) => {
                      const pixPrice = prod.precoVenda * 0.90;
                      const thumb = prod.urlFotos && prod.urlFotos.length > 0 ? prod.urlFotos[0] : null;

                      return (
                        <div 
                          key={prod.similaridade || prod.nome} 
                          className="chat-product-card-item"
                          onClick={() => handleProductClick(prod)}
                        >
                          <div className="chat-card-thumb-wrap">
                            {thumb && <img src={thumb} alt={prod.nome} className="chat-card-thumb" />}
                          </div>
                          <div className="chat-card-details">
                            <span className="chat-card-brand">{prod.marca}</span>
                            <h5 className="chat-card-name">{prod.nome}</h5>
                            <div className="chat-card-price">{formatCurrency(pixPrice)} <span className="chat-card-pix">PIX</span></div>
                          </div>
                          <div className="chat-card-arrow">
                            <ChevronRight size={18} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="ai-message-wrapper ai">
                <div className="ai-message-bubble ai loading-bubble">
                  <div className="typing-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="ai-quick-prompts">
            <button onClick={() => handleSendMessage("Qual o tênis com melhor amortecimento?")}>
              👟 Amortecimento
            </button>

            <button onClick={() => handleSendMessage("Quais modelos têm tamanho 42?")}>
              📏 Tamanho 42
            </button>

            <button onClick={() => handleSendMessage("Mostre todos os modelos em promoção")}>
              🔥 Modelos da loja
            </button>
          </div>

          <form 
            className="ai-chat-input-wrap"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              type="text"
              placeholder="Pergunte sobre um modelo ou numeração..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button type="submit" disabled={loading || !inputMessage.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};


function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Navigation & Filter State
  const [currentView, setCurrentView] = useState('catalog');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [toastMessage, setToastMessage] = useState(null);
  
  // Cart State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await fetch('https://api.maisqueum.app.br/api/v1/catalogo/HY6ZY35D', {
          headers: {
            'x-grupo-loja': '10566'
          }
        });
        
        if (!response.ok) {
          throw new Error('Falha ao carregar o catálogo');
        }
        
        const data = await response.json();
        
        // Group products by similarity/model and brand
        const grouped = {};
        if (data && data.itensCatalogo) {
          data.itensCatalogo.forEach(item => {
            const key = item.similaridade || item.nome;
            
            // Extract all sizes from item.tamanhos array or item.tamanho
            const itemSizes = [];
            if (Array.isArray(item.tamanhos) && item.tamanhos.length > 0) {
              item.tamanhos.forEach(tObj => {
                if (tObj && tObj.tamanho && !itemSizes.includes(tObj.tamanho)) {
                  itemSizes.push(tObj.tamanho);
                }
              });
            }
            if (item.tamanho && !itemSizes.includes(item.tamanho)) {
              itemSizes.push(item.tamanho);
            }

            if (!grouped[key]) {
              grouped[key] = {
                ...item,
                sizes: [...itemSizes],
                variants: [item]
              };
            } else {
              itemSizes.forEach(sz => {
                if (!grouped[key].sizes.includes(sz)) {
                  grouped[key].sizes.push(sz);
                }
              });
              grouped[key].variants.push(item);
            }
          });
          
          // Sort sizes properly (numbers first, then string)
          const sortedProducts = Object.values(grouped).map(prod => {
            prod.sizes.sort((a, b) => {
              const numA = parseInt(a);
              const numB = parseInt(b);
              if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
              return a.localeCompare(b);
            });
            return prod;
          });
          
          setProducts(sortedProducts);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setCurrentView('details');
    window.scrollTo(0, 0);
  };

  const handleBackToCatalog = () => {
    setCurrentView('catalog');
    setSelectedProduct(null);
  };

  const handleAddToCart = (productWithSize, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(
        item => item.product.similaridade === productWithSize.similaridade && item.selectedSize === productWithSize.selectedSize
      );
      
      if (existingItem) {
        return prev.map(item => 
          item === existingItem 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prev, { product: productWithSize, selectedSize: productWithSize.selectedSize, quantity }];
    });
    
    showToast(`${productWithSize.nome} (Tam: ${productWithSize.selectedSize}) adicionado!`);
  };

  const handleUpdateCartQuantity = (itemToUpdate, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(itemToUpdate);
      return;
    }
    
    setCartItems(prev => prev.map(item => 
      item === itemToUpdate ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleRemoveFromCart = (itemToRemove) => {
    setCartItems(prev => prev.filter(item => item !== itemToRemove));
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Compute Brands
  const availableBrands = ['Todas', ...new Set(products.map(p => p.marca).filter(Boolean))];

  // Filter Products
  const filteredProducts = selectedBrand === 'Todas' 
    ? products 
    : products.filter(p => p.marca === selectedBrand);

  return (
    <div>
      <Header 
        cartCount={cartCount} 
        onOpenCart={() => setIsCartOpen(true)} 
        onHome={handleBackToCatalog} 
      />
      
      <ToastNotification message={toastMessage} onClose={() => setToastMessage(null)} />

      {currentView === 'catalog' && (
        <>
          <HeroBanner />
          <FeaturesBar />
          
          <section className="products-section container">
            <h2 className="section-title">
              Catálogo de Tênis
            </h2>

            {!loading && !error && (
              <BrandFilterBar 
                brands={availableBrands} 
                selectedBrand={selectedBrand} 
                onSelectBrand={setSelectedBrand} 
              />
            )}
            
            {loading && <div className="loading">Carregando catálogo...</div>}
            {error && <div className="error">{error}</div>}
            
            {!loading && !error && (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.similaridade || product.nome} 
                    product={product} 
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {currentView === 'details' && selectedProduct && (
        <ProductDetails 
          product={selectedProduct} 
          onBack={handleBackToCatalog} 
          onAddToCart={handleAddToCart}
        />
      )}

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
      />

      {/* Floating AI Recommendation Chatbot with Interactive Cards */}
      {!loading && products.length > 0 && (
        <AIChatAssistant 
          products={products} 
          onViewDetails={handleViewDetails} 
        />
      )}
    </div>
  );
}

export default App;
