package br.com.fiap.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ProductDaily.
 */
@Entity
@Table(name = "product_daily")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProductDaily implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "updated_date", nullable = false)
    private LocalDate updatedDate;

    @NotNull
    @Column(name = "value", nullable = false)
    private Long value;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "category", "productNames" }, allowSetters = true)
    private Product product;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "country", "cityNames" }, allowSetters = true)
    private City city;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProductDaily id(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getUpdatedDate() {
        return this.updatedDate;
    }

    public ProductDaily updatedDate(LocalDate updatedDate) {
        this.updatedDate = updatedDate;
        return this;
    }

    public void setUpdatedDate(LocalDate updatedDate) {
        this.updatedDate = updatedDate;
    }

    public Long getValue() {
        return this.value;
    }

    public ProductDaily value(Long value) {
        this.value = value;
        return this;
    }

    public void setValue(Long value) {
        this.value = value;
    }

    public Product getProduct() {
        return this.product;
    }

    public ProductDaily product(Product product) {
        this.setProduct(product);
        return this;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public City getCity() {
        return this.city;
    }

    public ProductDaily city(City city) {
        this.setCity(city);
        return this;
    }

    public void setCity(City city) {
        this.city = city;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProductDaily)) {
            return false;
        }
        return id != null && id.equals(((ProductDaily) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProductDaily{" +
            "id=" + getId() +
            ", updatedDate='" + getUpdatedDate() + "'" +
            ", value=" + getValue() +
            "}";
    }
}
