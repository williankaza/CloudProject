package br.com.fiap.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Product.
 */
@Entity
@Table(name = "product")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "weight")
    private Long weight;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "categoryNames" }, allowSetters = true)
    private ProductCategory category;

    @OneToMany(mappedBy = "product")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "product", "city" }, allowSetters = true)
    private Set<ProductDaily> productNames = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product id(Long id) {
        this.id = id;
        return this;
    }

    public String getProductName() {
        return this.productName;
    }

    public Product productName(String productName) {
        this.productName = productName;
        return this;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Long getWeight() {
        return this.weight;
    }

    public Product weight(Long weight) {
        this.weight = weight;
        return this;
    }

    public void setWeight(Long weight) {
        this.weight = weight;
    }

    public ProductCategory getCategory() {
        return this.category;
    }

    public Product category(ProductCategory productCategory) {
        this.setCategory(productCategory);
        return this;
    }

    public void setCategory(ProductCategory productCategory) {
        this.category = productCategory;
    }

    public Set<ProductDaily> getProductNames() {
        return this.productNames;
    }

    public Product productNames(Set<ProductDaily> productDailies) {
        this.setProductNames(productDailies);
        return this;
    }

    public Product addProductName(ProductDaily productDaily) {
        this.productNames.add(productDaily);
        productDaily.setProduct(this);
        return this;
    }

    public Product removeProductName(ProductDaily productDaily) {
        this.productNames.remove(productDaily);
        productDaily.setProduct(null);
        return this;
    }

    public void setProductNames(Set<ProductDaily> productDailies) {
        if (this.productNames != null) {
            this.productNames.forEach(i -> i.setProduct(null));
        }
        if (productDailies != null) {
            productDailies.forEach(i -> i.setProduct(this));
        }
        this.productNames = productDailies;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Product)) {
            return false;
        }
        return id != null && id.equals(((Product) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Product{" +
            "id=" + getId() +
            ", productName='" + getProductName() + "'" +
            ", weight=" + getWeight() +
            "}";
    }
}
