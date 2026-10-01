export interface Product {
  readonly id: string;
  readonly name: string;
  readonly category: 'Periféricos' | 'Áudio' | 'Acessórios' | 'Monitores';
  readonly price: number;
  readonly emoji: string;
  readonly rating: number;
  readonly description: string;
}

export const PRODUCTS: readonly Product[] = [
  { id: 'kb-01', name: 'Teclado Mecânico Pro', category: 'Periféricos', price: 459.9, emoji: '⌨️', rating: 4.8, description: 'Switches táteis, layout ABNT2, RGB.' },
  { id: 'ms-02', name: 'Mouse Ergonômico', category: 'Periféricos', price: 219.0, emoji: '🖱️', rating: 4.5, description: 'Sensor 8K DPI, 6 botões programáveis.' },
  { id: 'hp-03', name: 'Headset Studio', category: 'Áudio', price: 389.5, emoji: '🎧', rating: 4.7, description: 'Cancelamento de ruído ativo, 40h de bateria.' },
  { id: 'sp-04', name: 'Caixa de Som Bluetooth', category: 'Áudio', price: 279.0, emoji: '🔊', rating: 4.3, description: 'Resistente a água, graves profundos.' },
  { id: 'mn-05', name: 'Monitor 27" 4K', category: 'Monitores', price: 1899.0, emoji: '🖥️', rating: 4.9, description: 'IPS, 144Hz, HDR400.' },
  { id: 'mn-06', name: 'Monitor Ultrawide 34"', category: 'Monitores', price: 2799.0, emoji: '📺', rating: 4.6, description: 'Curvo 1500R, USB-C 90W.' },
  { id: 'wc-07', name: 'Webcam Full HD', category: 'Acessórios', price: 199.9, emoji: '📷', rating: 4.1, description: 'Autofoco, microfone duplo.' },
  { id: 'hb-08', name: 'Hub USB-C 8 em 1', category: 'Acessórios', price: 149.0, emoji: '🔌', rating: 4.4, description: 'HDMI 4K, leitor SD, 100W PD.' },
];
