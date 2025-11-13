from django.db import models


class Member(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=50)
    about = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_authenticated(self):
        # DRF expects this property for authenticated principals
        return True

    def __str__(self):
        return f"{self.username}"


class Ad(models.Model):
    CATEGORY_CHOICES = [
        ("Автомобили", "Автомобили"),
        ("Недвижимость", "Недвижимость"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    contact_phone = models.CharField(max_length=50)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    author = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="ads")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.category})"
