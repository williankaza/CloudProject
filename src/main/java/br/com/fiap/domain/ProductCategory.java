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
 * A ProductCategory.
 */
@Entity
@Table(name = "product_category")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProductCategory implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "category_name", nullable = false)
    private String categoryName;

    @OneToMany(mappedBy = "category")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "category", "productNames" }, allowSetters = true)
    private Set<Product> categoryNames = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProductCategory id(Long id) {
        this.id = id;
        return this;
    }

    public String getCategoryName() {
        return this.categoryName;
    }

    public ProductCategory categoryName(String categoryName) {
        this.categoryName = categoryName;
        return this;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Set<Product> getCategoryNames() {
        return this.categoryNames;
    }

    public ProductCategory categoryNames(Set<Product> products) {
        this.setCategoryNames(products);
        return this;
    }

    public ProductCategory addCategoryName(Product product) {
        this.categoryNames.add(product);
        product.setCategory(this);
        return this;
    }

    public ProductCategory removeCategoryName(Product product) {
        this.categoryNames.remove(product);
        product.setCategory(null);
        return this;
    }

    public void setCategoryNames(Set<Product> products) {
        if (this.categoryNames != null) {
            this.categoryNames.forEach(i -> i.setCategory(null));
        }
        if (products != null) {
            products.forEach(i -> i.setCategory(this));
        }
        this.categoryNames = products;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProductCategory)) {
            return false;
        }
        return id != null && id.equals(((ProductCategory) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProductCategory{" +
            "id=" + getId() +
            ", categoryName='" + getCategoryName() + "'" +
            "}";
    }
}
